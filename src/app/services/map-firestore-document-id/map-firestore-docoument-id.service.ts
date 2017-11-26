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

    public mapBudgetIds(collection: AngularFirestoreCollection<Budget>): Observable<BudgetId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data();
                const budgetId = a.payload.doc.id;
                return {budgetId, ...data};
            });
        });
    }

    public mapBudgetAccountIds(collection: AngularFirestoreCollection<BudgetAccount>): Observable<BudgetAccountId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data();
                const budgetAccountId = a.payload.doc.id;
                return {budgetAccountId, ...data};
            });
        });
    }

    public mapCategoryGroupIds(collection: AngularFirestoreCollection<CategoryGroup>): Observable<CategoryGroupId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data();
                const groupId = a.payload.doc.id;
                return {groupId, ...data};
            });
        });
    }

    public mapCategoryIds(collection: AngularFirestoreCollection<Category>): Observable<CategoryId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data();
                const categoryId = a.payload.doc.id;
                return {categoryId, ...data};
            });
        });
    }
}
