import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CategoryGroup, CategoryGroupId, GroupAndCategories } from '../../../../models/category-group.model';
import { Category, CategoryId } from '../../../../models/category.model';
import { FirestoreReferenceService } from '../firestore-reference/firestore-reference.service';
import { BudgetAccount, BudgetAccountId } from '../../../../models/budget-account.model';
import { BudgetId, Budget } from '../../../../models/budget.model';
import { CollectionResult } from '../../../../models/collection-result.model';

@Injectable()
export class MapFirestoreDocumentIdService {

    constructor() {
    }

    // public mapIds<CollType, IdType>(collection: AngularFirestoreCollection<CollType>) {
    //     return collection.snapshotChanges().map(actions => {
    //         return actions.map(a => {
    //             const data: CollType = a.payload.doc.data() as CollType;
    //             // set id property here
    //             const id = a.payload.doc.id;
    //             return { id, ...data } as IdType;

    //             // return { //property name }
    //         })
    //     })
    // }

    public mapBudgetIds(collection: AngularFirestoreCollection<Budget>): Observable<BudgetId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data() as Budget;
                const categoryId = a.payload.doc.id;
                return {categoryId, ...data} as BudgetId;
            });
        });
    }

    public mapBudgetAccountIds(collection: AngularFirestoreCollection<BudgetAccount>): Observable<BudgetAccountId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data() as BudgetAccount;
                const categoryId = a.payload.doc.id;
                return {categoryId, ...data} as BudgetAccountId;
            });
        });
    }

    public mapCategoryGroupIds(collection: AngularFirestoreCollection<CategoryGroup>): Observable<CategoryGroupId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data() as CategoryGroup;
                const categoryId = a.payload.doc.id;
                return {categoryId, ...data} as CategoryGroupId;
            });
        });
    }

    public mapCategoryIds(collection: AngularFirestoreCollection<Category>): Observable<CategoryId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data() as Category;
                const categoryId = a.payload.doc.id;
                return {categoryId, ...data} as CategoryId;
            });
        });
    }
}
