import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { MapFirestoreDocumentIdService } from '../map-firestore-document-id/map-firestore-docoument-id.service';
import { FirestoreReferenceService } from '../firestore-reference/firestore-reference.service';
import { CollectionResult } from '../../../../models/collection-result.model';
import { BudgetAccount, BudgetAccountId } from '../../../../models/budget-account.model';
import { CategoryGroup, CategoryGroupId } from '../../../../models/category-group.model';
import { Category, CategoryId } from '../../../../models/category.model';
import { Budget, BudgetId } from '../../../../models/budget.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Injectable()
export class FirestoreService {

    constructor(private mapDocumentId: MapFirestoreDocumentIdService,
                private references: FirestoreReferenceService,
                private afs: AngularFirestore) {
    }

    public createId(): string {
        return this.afs.createId();
    }

    public getBudgets(userId): CollectionResult<Budget, BudgetId[]> {
        const budgetCollection: AngularFirestoreCollection<Budget> = this.references.getBudgetCollectionRef(userId);
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

    public getBudgetGroups(budgetId: string): CollectionResult<CategoryGroup, CategoryGroupId[]> {
        const groupCollection: AngularFirestoreCollection<CategoryGroup> = this.references.getCategoryGroupCollectionRef(budgetId);
        const groupObservable: Observable<CategoryGroupId[]> = this.mapDocumentId.mapCategoryGroupIds(groupCollection);

        return {
            collection: groupCollection,
            observable: groupObservable
        };
    }

    public getBudgetCategories(budgetId: string): CollectionResult<Category, CategoryId[]> {
        const categoryCollection: AngularFirestoreCollection<Category> = this.references.getCategoryCollectionRef(budgetId);
        const categoryObservable: Observable<CategoryId[]> = this.mapDocumentId.mapCategoryIds(categoryCollection);

        return {
            collection: categoryCollection,
            observable: categoryObservable
        };
    }

    public getGroupsAndCategories(budgetId: string) {
        const groupCollection: AngularFirestoreCollection<CategoryGroup> = this.references.getCategoryGroupCollectionRef(budgetId);
        const groupObservable: Observable<CategoryGroupId[]> = this.mapDocumentId.mapCategoryGroupIds(groupCollection);

        const categoryCollection = this.references.getCategoryCollectionRef(budgetId);
        const categoriesObservable: Observable<CategoryId[]> = this.mapDocumentId.mapCategoryIds(categoryCollection);

        return Observable.combineLatest(groupObservable, categoriesObservable, (groups, categories) => {

            const formattedData = groups.map((group: CategoryGroupId) => {

                const getCategories = () => {
                    return categories.filter((category: CategoryId) => {
                        return category.groupId === group.groupId;
                    });
                };

                return {...group, categories: getCategories()};
            });

            return {
                groupCollection: groupCollection,
                categoryCollection: categoryCollection,
                data: formattedData
            };
        });
    }
}
