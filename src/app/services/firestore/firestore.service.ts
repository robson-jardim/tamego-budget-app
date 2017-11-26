import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { MapFirestoreDocumentIdService } from '../map-firestore-document-id/map-firestore-docoument-id.service';
import { FirestoreReferenceService } from '../firestore-reference/firestore-reference.service';
import { CollectionResult } from '../../../../models/collection-result.model';
import { BudgetAccount, BudgetAccountId } from '../../../../models/budget-account.model';
import { GroupAndCategories, CategoryGroup, CategoryGroupId } from '../../../../models/category-group.model';
import { Category, CategoryId } from '../../../../models/category.model';
import { Budget, BudgetId } from '../../../../models/budget.model';
import { AuthGuard } from '../auth-guard/auth.guard';


@Injectable()
export class FirestoreService {
    public readonly userId;

    constructor(private mapDocumentId: MapFirestoreDocumentIdService,
                private references: FirestoreReferenceService,
                private authGuard: AuthGuard,
                private afs: AngularFirestore) {
                    this.userId = authGuard.userId;
    }

    public getBudgets(): CollectionResult<Budget, BudgetId[]> {
        const budgetCollection: AngularFirestoreCollection<Budget> = this.references.getBudgetCollectionRef();
        const budgetObservable: Observable<BudgetId[]> = this.mapDocumentId.mapBudgetIds(budgetCollection);

        const data: CollectionResult<Budget, BudgetId[]> = {
            collection: budgetCollection,
            observable: budgetObservable
        };

        return data;
    }

    public getBudgetAccounts(budgetId: string): CollectionResult<BudgetAccount, BudgetAccountId[]> {

        const accountCollection: AngularFirestoreCollection<BudgetAccount> = this.references.getBudgetAccountCollectionRef(budgetId);
        const accountObservable: Observable<BudgetAccountId[]> = this.mapDocumentId.mapBudgetAccountIds(accountCollection);

        const data: CollectionResult<BudgetAccount, BudgetAccountId[]> = {
            collection: accountCollection,
            observable: accountObservable
        };

        return data;
    }

    public combineGroupAndCategories(budgetId: string): CollectionResult<CategoryGroup, GroupAndCategories[]> {

        const groupCollection: AngularFirestoreCollection<CategoryGroup> = this.references.getCategoryGroupCollectionRef(budgetId);
        const groupObservable: Observable<CategoryGroupId[]> = this.mapDocumentId.mapCategoryGroupIds(groupCollection);

        const groupAndCategories: Observable<GroupAndCategories[]> = groupObservable.map(groups => {
            return groups.map(group => {

                const categoryCollection = this.references.getCategoryCollectionRef(budgetId, group.groupId);
                const categoryObservable = this.mapDocumentId.mapCategoryIds(categoryCollection);

                const categories: CollectionResult<Category, CategoryId[]> = {
                    collection: categoryCollection,
                    observable: categoryObservable
                };

                return {categories, ...group} as GroupAndCategories;
            });
        });

        const result: CollectionResult<CategoryGroup, GroupAndCategories[]> = {
            collection: groupCollection,
            observable: groupAndCategories
        };

        return result;
    }

}
