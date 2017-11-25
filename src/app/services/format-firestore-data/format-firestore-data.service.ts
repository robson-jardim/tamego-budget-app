import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CategoryGroup, CategoryGroupId, GroupAndCategories } from '../../../../models/category-group.model';
import { Category, CategoryId } from '../../../../models/category.model';
import { FirestoreReferenceService } from '../firestore-reference/firestore-reference.service';
import { BudgetAccount, BudgetAccountId } from '../../../../models/budget-account.model';
import { BudgetId, Budget } from '../../../../models/budget.model';
import { FirestoreResult } from '../../../../models/firestore-result.model';

@Injectable()
export class FormatFirestoreDataService {

    constructor(private firebaseRef: FirestoreReferenceService) { }

    public setBudgetIds(collection: AngularFirestoreCollection<Budget>): Observable<BudgetId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data() as Budget;
                const categoryId = a.payload.doc.id;
                return { categoryId, ...data } as BudgetId;
            });
        });
    }

    public setBudgetAccountIds(collection: AngularFirestoreCollection<BudgetAccount>): Observable<BudgetAccountId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data() as BudgetAccount;
                const categoryId = a.payload.doc.id;
                return { categoryId, ...data } as BudgetAccountId;
            });
        });
    }

    public setCategoryGroupIds(collection: AngularFirestoreCollection<CategoryGroup>): Observable<CategoryGroupId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data() as CategoryGroup;
                const categoryId = a.payload.doc.id;
                return { categoryId, ...data } as CategoryGroupId;
            });
        });
    }

    public setCategoryIds(collection: AngularFirestoreCollection<Category>): Observable<CategoryId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data() as Category;
                const categoryId = a.payload.doc.id;
                return { categoryId, ...data } as CategoryId;
            });
        });
    }

    public combineGroupAndCategories(budgetId: string): FirestoreResult<any> {

        const groupCollection: AngularFirestoreCollection<CategoryGroup> = this.firebaseRef.getCategoryGroupCollectionRef(budgetId);
        const groupObservable: Observable<CategoryGroupId[]> = this.setCategoryGroupIds(groupCollection);

        const groupAndCategories: Observable<GroupAndCategories[]> = groupObservable.map(groups => {
            return groups.map(group => {

                const categoryCollection = this.firebaseRef.getCategoryCollectionRef(budgetId, group.groupId);
                const categoryObservable = this.setCategoryIds(categoryCollection);

                const categories: FirestoreResult<Category> = {
                    collection: categoryCollection,
                    observable: categoryObservable
                };

                return { categories, ...group } as GroupAndCategories;
            });
        });

        // Type 'any' is used to combine the mismatching types between collection and observable
        // This allows for similar usage across the codebase and avoids adding a more specific version of FirebaseResult
        const result: FirestoreResult<any> = {
            collection: groupCollection,
            observable: groupAndCategories
        };

        return result;
    }
}
