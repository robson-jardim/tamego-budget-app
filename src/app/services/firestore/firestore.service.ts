import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { MapFirestoreDocumentIdService } from '../map-firestore-document-id/map-firestore-docoument-id.service';
import { FirestoreReferenceService } from '../firestore-reference/firestore-reference.service';
import { CollectionResult } from '../../../../models/collection-result.model';
import { BudgetAccount, BudgetAccountId } from '../../../../models/budget-account.model';
import { CategoryGroup, CategoryGroupId } from '../../../../models/category-group.model';
import { Category, CategoryId } from '../../../../models/category.model';
import { Budget, BudgetId } from '../../../../models/budget.model';
import { AuthGuard } from '../auth-guard/auth.guard';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/first';

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

        const result: CollectionResult<Budget, BudgetId[]> = {
            collection: budgetCollection,
            observable: budgetObservable
        };

        return result;
    }

    public getBudgetAccounts(budgetId: string): CollectionResult<BudgetAccount, BudgetAccountId[]> {

        const accountCollection: AngularFirestoreCollection<BudgetAccount> = this.references.getBudgetAccountCollectionRef(budgetId);
        const accountObservable: Observable<BudgetAccountId[]> = this.mapDocumentId.mapBudgetAccountIds(accountCollection);

        const result: CollectionResult<BudgetAccount, BudgetAccountId[]> = {
            collection: accountCollection,
            observable: accountObservable
        };

        return result;
    }

    public getGroupsAndCategories(budgetId: string) {

        const groupCollection: AngularFirestoreCollection<CategoryGroup> = this.references.getCategoryGroupCollectionRef(budgetId);
        const groupObservable: Observable<CategoryGroupId[]> = this.mapDocumentId.mapCategoryGroupIds(groupCollection);

        const getCategories = (group) => {
            const categoryCollection: AngularFirestoreCollection<Category> = this.references.getCategoryCollectionRef(budgetId, group.groupId);
            const categoryObservable: Observable<CategoryId[]> = this.mapDocumentId.mapCategoryIds(categoryCollection).first();

            return categoryObservable.map(categories => {
                return {
                    groupName: group.groupName,
                    groupId: group.groupId,
                    categories: categories
                };
            });
        };

        const mainObs = groupObservable.mergeMap(groups => {
            return Observable.forkJoin(groups.map(group => getCategories(group)))
        });

        return {
            groupCollection: groupCollection,
            categoryCollection: this.references.getEntireCategoryColleciton(budgetId),
            mainObservable: mainObs,
            subObservable: this.references.getEntireCategoryColleciton(budgetId).valueChanges()
        };
    }

    public getCategories(group, budgetId) {
        const categoryCollection: AngularFirestoreCollection<Category> = this.references.getCategoryCollectionRef(budgetId, group.groupId);
        const categoryObservable: Observable<CategoryId[]> = this.mapDocumentId.mapCategoryIds(categoryCollection).first();

        return categoryObservable.map(categories => {
            return {
                groupName: group.groupName,
                groupId: group.groupId,
                categories: categories
            };
        });
    }
}
