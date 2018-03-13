import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { MapFirestoreDocumentIdService } from '../map-firestore-document-id/map-firestore-docoument-id.service';
import { FirestoreReferenceService } from '../firestore-reference/firestore-reference.service';
import { CollectionResult, CombinedCollectionResult } from '@models/collection-result.model';
import { Account, AccountId } from '@models/budget-account.model';
import { CategoryGroup, CategoryGroupId } from '@models/category-group.model';
import { Category, CategoryId } from '@models/category.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { CategoryValue, CategoryValueId } from '@models/category-value.model';
import 'rxjs/add/operator/skip';
import {
    ReoccurringTransaction,
    ReoccurringTransactionId,
    Transaction,
    TransactionId
} from '@models/transaction.model';
import { ReoccurringTransfer, ReoccurringTransferId, Transfer, TransferId } from '@models/transfer.model';
import { Payee, PayeeId } from '@models/payee.model';
import { ReoccurringService } from '@shared/services/reoccurring/reoccurring.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import { GroupWithCategories } from '@models/view-budget.model';
import { Budget, BudgetId } from '@models/budget.model';

@Injectable()
export class FirestoreService {

    constructor(private mapDocumentId: MapFirestoreDocumentIdService,
                private references: FirestoreReferenceService,
                private afs: AngularFirestore,
                private reoccurring: ReoccurringService,
                private utility: UtilityService) {
    }

    public createId(): string {
        return this.afs.createId();
    }

    public batch() {
        return this.afs.firestore.batch();
    }

    public getBudgets(userId): CollectionResult<Budget, BudgetId[]> {
        const collection = this.references.getBudgetCollectionRef(userId);
        const observable = this.mapDocumentId.mapBudgetIds(collection);
        return {collection, observable};
    }

    public getAccounts(budgetId: string): CollectionResult<Account, AccountId[]> {
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

    public getTransfers(budgetId: string, accountId: string): CollectionResult<Transfer, TransferId[]> {

        const collection = this.references.getTransferCollectionRef(budgetId);

        const originCollection = this.references.getTransferCollectionRef(budgetId, {
            accountId,
            findByAccountProperty: 'originAccountId'
        });
        const destinationCollection = this.references.getTransferCollectionRef(budgetId, {
            accountId,
            findByAccountProperty: 'destinationAccountId'
        });

        const origin$ = this.mapDocumentId.mapTransferIds(originCollection);
        const destination$ = this.mapDocumentId.mapTransferIds(destinationCollection);

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

    public getAllAccountIdsForBudget(budgetId: string): Observable<string[]> {
        return this.getAccounts(budgetId).observable.first()
            .map((accounts: AccountId[]) => {
                return accounts.map(x => x.accountId);
            });
    }

    public getReoccurringTransactions(budgetId: string, accountId: string): CollectionResult<ReoccurringTransaction, ReoccurringTransactionId[]> {
        return this.reoccurring.getReoccurringTransactions(budgetId, accountId);
    }

    public getReoccurringTransfers(budgetId: string, accountId: string): CollectionResult<ReoccurringTransfer, ReoccurringTransferId[]> {
        return this.reoccurring.getReoccurringTransfers(budgetId, accountId);
    }


    public getGroupWithCategories(budgetId: string): CombinedCollectionResult<GroupWithCategories[]> {
        const groupsResult = this.getGroups(budgetId);
        const categoriesResult = this.getCategories(budgetId);

        const combinedGroupsAndCategories$ = this.utility.combineLatestObj({
            groups: groupsResult.observable,
            categories: categoriesResult.observable
        }).map(({groups, categories}) => {

            return groups.map((group): GroupWithCategories => {
                const getCategories = () => {
                    return categories.filter(category => category.groupId === group.groupId && category);
                };

                return {
                    ...group,
                    categories: getCategories()
                };

            });

        });

        return {
            collections: {
                groups: groupsResult.collection,
                categories: categoriesResult.collection
            },
            observable: combinedGroupsAndCategories$
        };
    }

}
