import { Injectable } from '@angular/core';
import { CategoryGroup, CategoryGroupId } from '@models/category-group.model';
import { CollectionResult } from '@models/collection-result.model';
import { CategoryValue, CategoryValueId } from '@models/category-value.model';
import { Observable } from 'rxjs/Observable';
import { Category, CategoryId } from '@models/category.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';

@Injectable()
export class DashboardViewService {

    constructor(private firestore: FirestoreService) {
    }

    public getBudgetView(budgetId: string) {
        const groupsResult: CollectionResult<CategoryGroup, CategoryGroupId[]> = this.firestore.getGroups(budgetId);
        const categoriesResult: CollectionResult<Category, CategoryId[]> = this.firestore.getCategories(budgetId);
        const categoryValuesResult: CollectionResult<CategoryValue, CategoryValueId[]> = this.firestore.getCategoryValues(budgetId);

        const observables = [groupsResult.observable, categoriesResult.observable, categoryValuesResult.observable];
        return Observable.combineLatest(observables, (groups, categories, categoryValues) => {

            const formattedData = groups.map((group: CategoryGroupId) => {

                const getCategories = () => {
                    return categories.filter(c => c.groupId === group.groupId).map(category => {
                        category.values = categoryValues.filter(value => value.categoryId === category.categoryId);
                        return category;
                    });
                };

                return {...group, categories: getCategories()};
            });

            return {
                collections: {
                    groups: groupsResult.collection,
                    categories: categoriesResult.collection,
                    categoryValues: categoryValuesResult.collection
                },
                groups: formattedData
            };
        });
    }

    public getTransactionView(budgetId: string, accountIds: string[]) {

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
            orderByDate(data);
            return data;

            function flatten(array: Array<any>) {
                return array.reduce((a, b) => a.concat(b), []);
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
