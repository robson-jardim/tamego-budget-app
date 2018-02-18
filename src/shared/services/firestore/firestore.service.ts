import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { MapFirestoreDocumentIdService } from '../map-firestore-document-id/map-firestore-docoument-id.service';
import { FirestoreReferenceService } from '../firestore-reference/firestore-reference.service';
import { CollectionResult } from '@models/collection-result.model';
import { BudgetAccount, BudgetAccountId } from '@models/budget-account.model';
import { CategoryGroup, CategoryGroupId } from '@models/category-group.model';
import { Category, CategoryId } from '@models/category.model';
import { Budget, BudgetId } from '@models/budget.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { CategoryValue, CategoryValueId } from '@models/category-value.model';
import 'rxjs/add/operator/skip';
import {
    ReoccurringTransaction, ReoccurringTransactionId, Transaction,
    TransactionId
} from '@models/transaction.model';
import {
    ReoccurringTransferTransaction, ReoccurringTransferTransactionId, TransferTransaction,
    TransferTransactionId
} from '@models/transfer-transaction.model';
import { Payee, PayeeId } from '@models/payee.model';
import { ReoccurringTransactionService } from '@shared/services/reoccurring-transaction/reoccurring-transaction.service';
import { UtilityService } from '@shared/services/utility/utility.service';

@Injectable()
export class FirestoreService {

    constructor(private mapDocumentId: MapFirestoreDocumentIdService,
                private references: FirestoreReferenceService,
                private afs: AngularFirestore,
                private reoccurring: ReoccurringTransactionService,
                private utility: UtilityService) {
    }

    public generateId(): string {
        return this.afs.createId();
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

    public getPayees(budgetId: string): CollectionResult<Payee, PayeeId[]> {
        const collection = this.references.getPayeeCollectionRef(budgetId);
        const observable = this.mapDocumentId.mapPayeeIds(collection);
        return {collection, observable};
    }

    public getTransactions(budgetId: string, accountId: string): CollectionResult<Transaction, TransactionId[]> {
        const collection = this.references.getTransactionCollectionRef(budgetId, accountId);
        const observable = this.mapDocumentId.mapTransactionIds(collection);
        return {collection, observable};
    }

    public getTransferTransactions(budgetId: string, accountId: string): CollectionResult<TransferTransaction, TransferTransactionId[]> {

        const collection = this.references.getTransferTransactionCollectionRef(budgetId);

        const originCollection = this.references.getTransferTransactionCollectionRef(budgetId, {
            accountId,
            findByAccountProperty: 'originAccountId'
        });
        const destinationCollection = this.references.getTransferTransactionCollectionRef(budgetId, {
            accountId,
            findByAccountProperty: 'destinationAccountId'
        });

        const origin$ = this.mapDocumentId.mapTransferTransactionIds(originCollection);
        const destination$ = this.mapDocumentId.mapTransferTransactionIds(destinationCollection);

        const combinedTransfers = this.utility.combineLatestObj({
            origin: origin$,
            destination: destination$
        }).map(({origin, destination}) => {
            return [...origin, ...destination];
        });

        return {
            collection,
            observable: combinedTransfers
        };
    }

    public getReoccurringTransactions(budgetId: string, accountId: string): CollectionResult<ReoccurringTransaction, ReoccurringTransactionId[]> {
        return this.reoccurring.getReoccurringTransactions(budgetId, accountId);
    }

    public getReoccurringTransferTransactions(budgetId: string, accountId: string): CollectionResult<ReoccurringTransferTransaction, ReoccurringTransferTransactionId[]> {
        return this.reoccurring.getReoccurringTransferTransaction(budgetId, accountId);
    }


    // TODO - add groups and categories view model
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


}
