import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import {
    instanceOfReoccurringTransactionId,
    instanceOfTransactionId,
    ReoccurringTransactionId,
    TransactionId
} from '@models/transaction.model';
import {
    instanceOfReoccurringTransferId,
    instanceOfTransferId,
    ReoccurringTransferId,
    TransferId
} from '@models/transfer.model';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-transaction-table',
    templateUrl: './transaction-table.component.html',
    styleUrls: ['./transaction-table.component.scss']
})
export class TransactionTableComponent implements OnInit, OnDestroy {

    @Input() transactions;
    @Input() budgetId;
    @Input() accounts;
    @Input() payees;
    @Input() groups;
    @Input() onChange$;

    public dataSource;
    public displayedColumns = ['transactionDate', 'accountId', 'payeeId', 'categoryId', 'amount', 'balance', 'memo', 'status'];

    private onChangeSubscription: Subscription;

    constructor(private firestore: FirestoreService,
                private utility: UtilityService,
                private dialogService: CloseDialogService) {
    }

    ngOnInit() {
        this.buildDataSource();

        this.onChangeSubscription = this.onChange$.subscribe(() => {
            this.buildDataSource();
        });
    }

    ngOnDestroy() {
        this.onChangeSubscription.unsubscribe();
    }

    public trackTransactions(index, transaction: TransactionId | TransferId | ReoccurringTransactionId | ReoccurringTransferId) {
        if (transaction) {
            return (<TransactionId>transaction).transactionId ||
                (<TransferId>transaction).transferId ||
                (<ReoccurringTransactionId>transaction).reoccurringTransactionId ||
                (<ReoccurringTransferId>transaction).reoccurringTransferId;
        }
        else {
            return undefined;
        }
    }

    private buildDataSource() {

        let totalRunningBalance = this.transactions.map(x => x.amount).reduce((total, amount) => total + amount, 0);

        this.dataSource = this.transactions.map(t => {

            const getAccountName = () => {
                let accountName;

                if (instanceOfTransactionId(t) || instanceOfReoccurringTransactionId(t)) {
                    [accountName] = this.accounts.filter(x => x.accountId === t.accountId).map(x => x.accountName);
                }
                else if (instanceOfTransferId(t) || instanceOfReoccurringTransferId(t)) {
                    [accountName] = this.accounts.filter(x => x.accountId === t.originAccountId).map(x => x.accountName);
                }
                else {
                    throw new Error('Unable to determine transaction type');
                }

                return accountName;
            };

            const getPayeeName = () => {
                let payeeName;

                if (instanceOfTransactionId(t) || instanceOfReoccurringTransactionId(t)) {
                    [payeeName] = this.payees.filter(x => x.payeeId === t.payeeId).map(x => x.payeeName);
                }
                else if (instanceOfTransferId(t) || instanceOfReoccurringTransferId(t)) {
                    [payeeName] = this.accounts.filter(x => x.accountId === t.destinationAccountId).map(x => x.accountName);
                }
                else {
                    throw new Error('Unable to determine transaction type');
                }

                return payeeName;
            };

            const getCategoryName = () => {

                const [categoryField] = this.groups.map(group => {
                    const [categoryName] = group.categories
                        .filter(x => t.categoryId === x.categoryId)
                        .map(x => x.categoryName);

                    if (categoryName) {
                        // return group.groupName + ': ' + categoryName;
                        return categoryName;
                    }
                });

                return categoryField;

            };

            const transactionRunningBalance = totalRunningBalance;
            totalRunningBalance -= t.amount;

            return {
                rawData: t,
                viewData: {
                    accountName: getAccountName(),
                    payeeName: getPayeeName(),
                    categoryName: getCategoryName(),
                    runningBalance: transactionRunningBalance
                }
            };

        });
    }

    private getAccounts() {
        return this.firestore.getAccounts(this.budgetId).observable;
    }

    private getPayees() {
        return this.firestore.getPayees(this.budgetId).observable;
    }

    private getGroups() {
        return this.firestore.getGroupWithCategories(this.budgetId).observable;
    }

    public updateTransaction(transaction: TransactionId | TransferId | ReoccurringTransactionId | ReoccurringTransferId) {
        this.dialogService.openUpdate(TransactionDialogComponent, {
            data: {
                budgetId: this.budgetId,
                ...transaction
            }
        });
    }

    public isCleared(transaction: any) {
        return transaction.cleared || (transaction.clearedOrigin && transaction.clearedDestination);
    }

    public isLocked(transaction: any) {
        return transaction.locked || (transaction.lockedOrigin && transaction.lockedDestination);
    }

    public isReoccurring(transaction: any) {
        return instanceOfReoccurringTransactionId(transaction) || instanceOfReoccurringTransferId(transaction);
    }

    public isFutureDate(date: Date) {
        const today = new Date();
        const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        return date > utcToday;
    }

    public isTransfer(transaction: any) {
        return transaction.originAccountId && transaction.destinationAccountId;
    }
}
