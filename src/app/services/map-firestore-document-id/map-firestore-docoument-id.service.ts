import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CategoryGroup, CategoryGroupId } from '../../../../models/category-group.model';
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
                const budget: BudgetId = this.getDocData<BudgetId>(a);
                budget.budgetId = this.getDocId(a);
                return budget;
            });
        });
    }

    public mapBudgetAccountIds(collection: AngularFirestoreCollection<BudgetAccount>): Observable<BudgetAccountId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const account: BudgetAccountId = this.getDocData<BudgetAccountId>(a);
                account.budgetAccountId = this.getDocId(a);
                return account;
            });
        });
    }

    public mapCategoryGroupIds(collection: AngularFirestoreCollection<CategoryGroup>): Observable<CategoryGroupId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const categoryGroup: CategoryGroupId = this.getDocData<CategoryGroupId>(a);
                categoryGroup.groupId = this.getDocId(a);
                return categoryGroup;
            });
        });
    }

    public mapCategoryIds(collection: AngularFirestoreCollection<Category>): Observable<CategoryId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const category: CategoryId = this.getDocData<CategoryId>(a);
                category.categoryId = this.getDocId(a);
                return category;
            });
        });
    }

    private getDocData<T>(action: DocumentChangeAction) {
        return action.payload.doc.data() as T;
    }

    private getDocId(action: DocumentChangeAction) {
        return action.payload.doc.id;
    }
}
