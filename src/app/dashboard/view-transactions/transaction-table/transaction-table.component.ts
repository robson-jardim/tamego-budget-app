import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import { instanceOfReoccurringTransactionId, instanceOfTransactionId } from '@models/transaction.model';
import { instanceOfReoccurringTransferId, instanceOfTransferId } from '@models/transfer.model';

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

    public dataSource;

    public displayedColumns = ['accountId', 'transactionDate', 'payeeId', 'categoryId', 'amount', 'memo'];

    constructor(private firestore: FirestoreService,
                private utility: UtilityService) {
    }

    ngOnInit() {
        this.buildDataSource();
    }

    private buildDataSource() {
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

                const [fullName] = this.groups.map(group => {
                    const [name] = group.categories
                        .filter(x => t.categoryId === x.categoryId)
                        .map(x => x.categoryName);

                    if (name) {
                        return group.groupName + ': ' + name;
                    }
                });

                return fullName;

            };

            return {
                rawData: t,
                viewData: {
                    accountName: getAccountName(),
                    payeeName: getPayeeName(),
                    categoryName: getCategoryName()
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

}
