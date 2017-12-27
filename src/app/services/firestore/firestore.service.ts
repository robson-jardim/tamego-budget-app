import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { MapFirestoreDocumentIdService } from '../map-firestore-document-id/map-firestore-docoument-id.service';
import { FirestoreReferenceService } from '../firestore-reference/firestore-reference.service';
import { CollectionResult } from '../../../../models/collection-result.model';
import { BudgetAccount, BudgetAccountId } from '../../../../models/budget-account.model';
import { CategoryGroup, CategoryGroupId } from '../../../../models/category-group.model';
import { Category, CategoryId } from '../../../../models/category.model';
import { Budget, BudgetId } from '../../../../models/budget.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { CategoryValue, CategoryValueId } from '../../../../models/category-value.model';
import 'rxjs/add/operator/skip';
import { Transaction, TransactionId } from '../../../../models/transaction.model';
import { SplitTransaction, SplitTransactionId } from '../../../../models/split-transaction.model';
import { TransferTransaction, TransferTransactionId } from '../../../../models/transfer-transaction.model';

@Injectable()
export class FirestoreService {

    constructor(private mapDocumentId: MapFirestoreDocumentIdService,
                private references: FirestoreReferenceService,
                private afs: AngularFirestore) {
    }

    public generateId(): string {
        return this.afs.createId();
    }

    public static get currentTimestamp() {
        return new Date();
    }

    public static get currentMonth() {
        return new Date().getMonth() + 1;
    }

    public static get currentYear() {
        return new Date().getFullYear();
    }

    public getBudgets(userId): CollectionResult<Budget, BudgetId[]> {
        const collection = this.references.getBudgetCollectionRef(userId);
        const observable = this.mapDocumentId.mapBudgetIds(collection);
        return {collection, observable};
    }

    public getAccounts(budgetId: string): CollectionResult<BudgetAccount, BudgetAccountId[]> {
        const collection = this.references.getAccountsCollectionRef(budgetId);
        const observable = this.mapDocumentId.mapBudgetAccountIds(collection);
        return {collection, observable};
    }

    public getGroupsAndCategories(budgetId: string) {

        const categoriesResult = this.getCategories(budgetId);
        const groupsResult = this.getGroups(budgetId);

        const observables = [groupsResult.observable, categoriesResult.observable];

        return Observable.combineLatest(observables, (groups: CategoryGroupId[], categories: CategoryId[]) => {

            const formattedData = groups.map(group => {
                const getCategories = () => {
                    return categories.filter(category => category.groupId === group.groupId);
                };

                return {
                    ...group,
                    categories: getCategories()
                };
            });

            return {
                collections: {
                    groups: groupsResult.collection,
                    categories: categoriesResult.collection
                },
                data: formattedData
            };
        });
    }

    public getGroups(budgetId: string): CollectionResult<CategoryGroup, CategoryGroupId[]> {
        const collection = this.references.getGroupsCollectionRef(budgetId);
        const observable = this.mapDocumentId.mapCategoryGroupIds(collection);
        return {collection, observable};
    }

    public getCategories(budgetId: string): CollectionResult<Category, CategoryId[]> {
        const collection = this.references.getCategoriesCollectionRef(budgetId);
        const observable = this.mapDocumentId.mapCategoryIds(collection);
        return {collection, observable};
    }

    public getCategoryValues(budgetId: string): CollectionResult<CategoryValue, CategoryValueId[]> {
        const collection = this.references.getCategoryValuesCollectionRef(budgetId);
        const observable = this.mapDocumentId.mapCategoryValueIds(collection);
        return {collection, observable};
    }

    public getTransactions(budgetId: string, accountId: string): CollectionResult<Transaction, TransactionId[]> {
        const collection = this.references.getTransactionCollectionRef(budgetId, accountId);
        const observable = this.mapDocumentId.mapTransactionIds(collection);
        return {collection, observable};
    }

    private getSplitTransactions(budgetId: string): CollectionResult<SplitTransaction, SplitTransactionId[]> {
        const collection = this.references.getSplitTransactionCollectionRef(budgetId);
        const observable = this.mapDocumentId.mapSplitTransactionIds(collection);
        return {collection, observable};
    }


    private getTransferTransactions(budgetId: string, accountId: string): Observable<TransferTransactionId[]> {
        const origin = this.references.getOriginTransfersCollectionRef(budgetId, accountId);
        const destination = this.references.getDestinationTransfersCollectionRef(budgetId, accountId);

        const originObservable = this.mapDocumentId.mapTransferTransactionIds(origin);
        const destinationObservable = this.mapDocumentId.mapTransferTransactionIds(destination);

        return Observable.combineLatest(originObservable, destinationObservable, (origin, destination) => {
            return [...origin, ...destination];
        });
    }

    public getBudgetView(budgetId: string) {
        const groupsResult: CollectionResult<CategoryGroup, CategoryGroupId[]> = this.getGroups(budgetId);
        const categoriesResult: CollectionResult<Category, CategoryId[]> = this.getCategories(budgetId);
        const categoryValuesResult: CollectionResult<CategoryValue, CategoryValueId[]> = this.getCategoryValues(budgetId);

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

        const observables = [];

        accountIds.forEach(accountId => {

            const transactions = this.getTransactions(budgetId, accountId);
            const transfers = this.getTransferTransactions(budgetId, accountId);

            observables.push(transactions.observable);
            observables.push(transfers);
        });

        return Observable.combineLatest(observables, (...observablesData) => {

            let data = [...observablesData];
            data = flatten(data);
            orderByDate(data);

            return {
                collections: {
                    transactions: this.references.getTransactionCollectionRef(budgetId),
                    transfers: this.references.getTransfers(budgetId)
                },
                data
            };

            function flatten(array: Array<any>) {
                return [].concat.apply([], array);
            }

            function orderByDate(array: Array<any>) {
                array.sort((aa, bb) => {
                    const a = new Date(aa.transactionDate);
                    const b = new Date(bb.transactionDate);

                    return a > b ? -1 : a < b ? 1 : 0;
                });
            }

        });

        //
        // return Observable.combineLatest(observables, (transactions: TransactionId[], splitTransactions: SplitTransactionId[]) => {
        //
        //     const transactionIdToSplits = new Map();
        //
        //     splitTransactions.forEach(split => {
        //
        //         const transactionId = split.transactionId;
        //
        //         if (transactionIdToSplits.has(transactionId)) {
        //             const splits = transactionIdToSplits.get(transactionId);
        //             splits.push(split);
        //             transactionIdToSplits.set(transactionId, splits);
        //         }
        //         else {
        //             transactionIdToSplits.set(transactionId, [split]);
        //         }
        //
        //     });
        //
        //     return transactions.map((transaction: any) => {
        //
        //         const transactionId = transaction.transactionId;
        //
        //         if (transactionIdToSplits.has(transactionId)) {
        //             transaction.splits = transactionIdToSplits.get(transactionId);
        //         }
        //
        //         return transaction;
        //     });
        //
        // });
    }

}
