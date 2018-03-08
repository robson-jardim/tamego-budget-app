import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import {
    instanceOfReoccurringTransactionId, instanceOfTransactionId, ReoccurringTransactionId,
    TransactionId
} from '@models/transaction.model';
import {
    instanceOfReoccurringTransferId, instanceOfTransferId, ReoccurringTransferId,
    TransferId
} from '@models/transfer.model';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';

@Component({
    selector: 'app-transaction-table',
    templateUrl: './transaction-table.component.html',
    styleUrls: ['./transaction-table.component.scss']
})
export class TransactionTableComponent implements OnInit {

    @Input() transactions;
    @Input() budgetId;
    @Input() accounts;
    @Input() payees;
    @Input() groups;
    @Input() onChange;

    public dataSource;
    public displayedColumns = ['accountId', 'transactionDate', 'payeeId', 'categoryId', 'amount', 'memo', 'runningBalance'];

    constructor(private firestore: FirestoreService,
                private utility: UtilityService,
                private dialogService: CloseDialogService) {
    }

    ngOnInit() {
        this.onChange.subscribe(() => {
            this.buildDataSource();
        });
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
                const [accountName] = this.accounts.filter(x => x.accountId === t.accountId).map(x => x.accountName);
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
}
