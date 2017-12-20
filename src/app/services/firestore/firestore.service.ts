///<reference path="../../../../models/category-value.model.ts"/>
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { MapFirestoreDocumentIdService } from '../map-firestore-document-id/map-firestore-docoument-id.service';
import { FirestoreReferenceService } from '../firestore-reference/firestore-reference.service';
import { CollectionResult } from '../../../../models/collection-result.model';
import { BudgetAccount, BudgetAccountId } from '../../../../models/budget-account.model';
import { CategoryGroup, CategoryGroupId } from '../../../../models/category-group.model';
import { Category, CategoryId } from '../../../../models/category.model';
import { Budget, BudgetId } from '../../../../models/budget.model';
import * as firebase from 'firebase';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { CategoryValue, CategoryValueId } from '../../../../models/category-value.model';
import 'rxjs/add/operator/skip';

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
        const collection: AngularFirestoreCollection<Budget> = this.references.getBudgetCollectionRef(userId);
        const observable: Observable<BudgetId[]> = this.mapDocumentId.mapBudgetIds(collection);
        return {collection, observable};
    }

    public getAccounts(budgetId: string): CollectionResult<BudgetAccount, BudgetAccountId[]> {
        const collection: AngularFirestoreCollection<BudgetAccount> = this.references.getAccountCollectionRef(budgetId);
        const observable: Observable<BudgetAccountId[]> = this.mapDocumentId.mapBudgetAccountIds(collection);
        return {collection, observable};
    }

    public getGroups(budgetId: string): CollectionResult<CategoryGroup, CategoryGroupId[]> {
        const collection: AngularFirestoreCollection<CategoryGroup> = this.references.getGroupCollectionRef(budgetId);
        const observable: Observable<CategoryGroupId[]> = this.mapDocumentId.mapCategoryGroupIds(collection);
        return {collection, observable};
    }

    public getCategories(budgetId: string): CollectionResult<Category, CategoryId[]> {
        const collection: AngularFirestoreCollection<Category> = this.references.getCategoryCollectionRef(budgetId);
        const observable: Observable<CategoryId[]> = this.mapDocumentId.mapCategoryIds(collection);
        return {collection, observable};
    }

    public getCategoryValues(budgetId: string): CollectionResult<CategoryValue, CategoryValueId[]> {
        const collection: AngularFirestoreCollection<CategoryValue> = this.references.getCategoryValuesCollectionRef(budgetId);
        const observable: Observable<CategoryValueId[]> = this.mapDocumentId.mapCategoryValueIds(collection);
        return {collection, observable};
    }

    public getEditBudget(budgetId: string) {
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
}
