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
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class FirestoreService {

    constructor(private mapDocumentId: MapFirestoreDocumentIdService,
                private references: FirestoreReferenceService) {
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
        }
    }

    public getBudgetCategories(budgetId: string): CollectionResult<Category, CategoryId[]> {
        const categoryCollection: AngularFirestoreCollection<Category> = this.references.getGeneralCategoryCollectionRef(budgetId);
        const categoryObservable: Observable<CategoryId[]> = this.mapDocumentId.mapCategoryIds(categoryCollection);

        return {
            collection: categoryCollection,
            observable: categoryObservable
        }
    }

    public getGroupsAndCategories(budgetId: any) {
        const group: Observable<CategoryGroup[]> = this.references.getCategoryGroupCollectionRef(budgetId).valueChanges();
        const category: Observable<Category[]> = this.references.getGeneralCategoryCollectionRef(budgetId).valueChanges();

        const groupCollection: AngularFirestoreCollection<CategoryGroup> = this.references.getCategoryGroupCollectionRef(budgetId);
        const groupObservable: Observable<CategoryGroupId[]> = this.mapDocumentId.mapCategoryGroupIds(groupCollection);


        return Observable.merge(group, category.skip(1)).switchMap(res => {

            const groups: Observable<CategoryGroup[]> = this.references.getCategoryGroupCollectionRef(budgetId).valueChanges();

            const groupCollection: AngularFirestoreCollection<CategoryGroup> = this.references.getCategoryGroupCollectionRef(budgetId);
            const groupObservable: Observable<CategoryGroupId[]> = this.mapDocumentId.mapCategoryGroupIds(groupCollection);

            return groups.flatMap(groups => {
                if (groups.length == 0) {
                    return Observable.of({
                        groupCollection: groupCollection,
                        categoryCollection: this.references.getGeneralCategoryCollectionRef(budgetId),
                        data: groups
                    });
                }
                else {
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

                    return groupObservable.flatMap(groups => {
                        return Observable.forkJoin(groups.map(group => getCategories(group))).map(groups => {
                            return {
                                groupCollection: groupCollection,
                                categoryCollection: this.references.getGeneralCategoryCollectionRef(budgetId),
                                data: groups
                            }
                        })
                    });
                }
            })
        });
    }
}
