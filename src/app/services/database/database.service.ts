import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthGuard } from '../auth-guard/auth.guard';
import { CategoryGroup, CategoryGroupId } from '../../../../models/category-group.model';
import { Category } from '../../../../models/category.model';
import { Budget, BudgetId } from '../../../../models/budget.model';
import { BudgetAccount, BudgetAccountId } from '../../../../models/budget-account.model';
import { BudgetGroup } from '../../components/edit-budget/edit-budget.component';

@Injectable()
export class DatabaseService {

    public readonly userId: string;

    constructor(private afs: AngularFirestore,
        private authGuard: AuthGuard) {
        this.userId = this.authGuard.userId;
    }

    public getBudgetCollection(): AngularFirestoreCollection<Budget> {
        const budgetCollection = this.afs.collection<Budget>('budgets', ref => ref.where('userId', '==', this.userId));
        return budgetCollection;
    }

    public getBudgetsWithIds(budgetCollection: AngularFirestoreCollection<Budget>): Observable<BudgetId[]> {
        const budgets = budgetCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Budget;
                const budgetId = a.payload.doc.id;
                return { budgetId, ...data };
            });
        });

        return budgets;
    }

    public getBudgetAccountCollection(budgetId: string): AngularFirestoreCollection<Account> {
        const budgetAccountCollection = this.afs.collection<Account>(`budgets/${budgetId}/accounts`);

        return budgetAccountCollection;
    }

    public getBudgetAccountsWithIds(budgetAccountCollection: AngularFirestoreCollection<Account>): Observable<BudgetAccountId[]> {
        const budgetAccounts = budgetAccountCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as BudgetAccount;
                const budgetAccountId = a.payload.doc.id;
                return { budgetAccountId, ...data };
            });
        });

        return budgetAccounts;
    }

    public getCategoryCollection(budgetId: string): AngularFirestoreCollection<Category> {
        return this.afs.collection<Category>(`budgets/${budgetId}/categoryGroups/categories`);
    }

    public getCategoriesWithIds(categoryCollection: AngularFirestoreCollection<Category>) {
        const categories = categoryCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Category;
                const categoryId = a.payload.doc.id;
                return { categoryId, ...data };
            });
        });

        return categories;
    }

    public getCategoryGroupsWithIds(categoryGroupCollection: AngularFirestoreCollection<CategoryGroupId>) {
        const groups = categoryGroupCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as CategoryGroup;
                const groupId = a.payload.doc.id;
                return { groupId, ...data };
            });
        });

        return groups;
    }

    public getCategoryGroupCollection(budgetId: string): AngularFirestoreCollection<CategoryGroup> {
        return this.afs.collection<CategoryGroup>(`budgets/${budgetId}/groups`);
    }

    public combineGroupAndCategories(budgetId: string): Observable<any> {

        const groupRef: any = this.getCategoryGroupCollection(budgetId);
        const groups$: any = this.getCategoryGroupsWithIds(groupRef);

        return groups$.map(groups => {
            return groups.map(x => {
                return {
                    groupId: x.groupId,
                    name: x.name,
                    categories: this.afs.collection<Category>(`budgets/${budgetId}/groups/${x.groupId}/categories`).valueChanges()
                }
            })
        })
    }
}



