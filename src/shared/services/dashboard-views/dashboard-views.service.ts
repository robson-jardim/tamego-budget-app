import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import { GroupWithCategoriesWithValues } from '@models/view-budget.model';
import {
    instanceOfReoccurringTransactionId,
    instanceOfTransactionId, ReoccurringTransactionId, TransactionId,
    TransactionType
} from '@models/transaction.model';
import {
    instanceOfReoccurringTransferId, instanceOfTransferId, ReoccurringTransferId,
    TransferId
} from '@models/transfer.model';

@Injectable()
export class DashboardViewService {

    constructor(private firestore: FirestoreService,
                private utility: UtilityService) {
    }

    public getBudgetView(budgetId: string): Observable<GroupWithCategoriesWithValues[]> {

        const groupsWithCategories$ = this.firestore.getGroupWithCategories(budgetId).observable;
        const categoryValues$ = this.firestore.getCategoryValues(budgetId).observable;

        return this.utility.combineLatestObj({
            groups: groupsWithCategories$,
            values: categoryValues$
        }).map(({groups, values}) => {

            const addValuesToCategories = () => {
                groups.map(group => {
                    group.categories.map(category => {
                        category.values = values.filter(value => value.categoryId === category.categoryId);
                    });
                });
            };

            addValuesToCategories();
            return groups;
        });
    }

    public getTransactionView(budgetId: string, accountIds: string[], options?: Object): Observable<Array<TransactionId | TransferId | ReoccurringTransactionId | ReoccurringTransferId>> {

        if (accountIds.length === 0) {
            return Observable.of([]);
        }

        const observables = [];

        accountIds.forEach(accountId => {

            const transactions = this.firestore.getTransactions(budgetId, accountId);
            const transfers = this.firestore.getTransfers(budgetId, accountId);
            const reoccurringTransactions = this.firestore.getReoccurringTransactions(budgetId, accountId);
            const reoccurringTransfers = this.firestore.getReoccurringTransfers(budgetId, accountId);

            observables.push(transactions.observable);
            observables.push(transfers.observable);
            observables.push(reoccurringTransactions.observable);
            observables.push(reoccurringTransfers.observable);
        });

        return Observable.combineLatest(observables, (...observablesData) => {

            let data = [...observablesData];
            data = flatten(data);
            data = removeDuplicateTransfers(data);
            orderByDate(data);
            return data;

            function flatten(array: Array<any>) {
                return array.reduce((a, b) => a.concat(b), []);
            }

            function removeDuplicateTransfers(transactions: TransactionType[]) {
                const ids = new Set();

                return transactions.filter(transaction => {

                    let currentId;

                    if (instanceOfTransactionId(transaction)) {
                        transaction = transaction as TransactionId;
                        currentId = transaction.transactionId;
                    }
                    else if (instanceOfReoccurringTransactionId(transaction)) {
                        transaction = transaction as ReoccurringTransactionId;
                        currentId = transaction.reoccurringTransactionId;
                    }
                    else if (instanceOfTransferId(transaction)) {
                        transaction = transaction as TransferId;
                        currentId = transaction.transferId;
                    }
                    else if (instanceOfReoccurringTransferId(transaction)) {
                        transaction = transaction as ReoccurringTransferId;
                        currentId = transaction.reoccurringTransferId;
                    }

                    if (ids.has(currentId)) {
                        return false;
                    }
                    else {
                        ids.add(currentId);
                        return true;
                    }
                });

            }

            function orderByDate(array: Array<any>) {
                array.sort((a, b) => {
                    const dateA = a.transactionDate;
                    const dateB = b.transactionDate;

                    if (dateA > dateB) {
                        return -1;
                    }
                    else if (dateA < dateB) {
                        return 1;
                    }
                    return 0;
                });
            }

        });

    }
}
