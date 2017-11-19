import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { AuthGuard } from "../auth-guard/auth.guard";

@Injectable()
export class DatabaseService {

    public readonly userId: string;


    private collect: AngularFirestoreCollection<CategoryGroup>;
    private obs: Observable<CategoryGroupId[]>;

    constructor (private afs: AngularFirestore,
                 private authGuard: AuthGuard) {
        this.userId = this.authGuard.userId;


    }

    public getTestCollection(): Observable<CategoryGroupId[]> {

        if(!this.obs) {
            console.log('here');
            this.collect = this.getCategoryGroupCollection('L6rXCcq3i1CnDqmb6kZu');
            this.obs = this.getCategoryGroupsWithIds(this.collect);
        }

        return this.obs;
    }

    public getBudgetCollection (): AngularFirestoreCollection<Budget> {
        const budgetCollection = this.afs.collection<Budget>('budgets', ref => ref.where('userId', '==', this.userId));
        return budgetCollection;
    }

    public getBudgetsWithIds (budgetCollection: AngularFirestoreCollection<Budget>): Observable<BudgetId[]> {
        const budgets = budgetCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Budget;
                const budgetId = a.payload.doc.id;
                return {budgetId, ...data};
            });
        });

        return budgets;
    }

    public getBudgetAccountCollection (budgetId: string): AngularFirestoreCollection<Account> {
        const budgetAccountCollection = this.afs.collection<Account>('budgetAccounts', ref =>
            ref.where('userId', '==', this.userId)
                .where('budgetId', '==', budgetId)
        );

        return budgetAccountCollection;
    }

    public getBudgetAccountsWithIds (budgetAccountCollection: AngularFirestoreCollection<Account>): Observable<AccountId[]> {
        const budgetAccounts = budgetAccountCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Account;
                const budgetAccountId = a.payload.doc.id;
                return {budgetAccountId, ...data};
            });
        });

        return budgetAccounts;
    }

    public getCategoryCollection (budgetId: string): AngularFirestoreCollection<Category> {
        return this.afs.collection<Category>(`budgets/${budgetId}/categories`);
    }

    public getCategoriesWithIds (categoryCollection: AngularFirestoreCollection<Category>) {
        const categories = categoryCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Category;
                const categoryId = a.payload.doc.id;
                return {categoryId, ...data};
            })
        });

        return categories;
    }

    public getCategoryGroupsWithIds (categoryGroupCollection: AngularFirestoreCollection<CategoryGroup>) {
        const groups = categoryGroupCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as CategoryGroup;
                const groupId = a.payload.doc.id;
                return {groupId, ...data};
            })
        });

        return groups;
    }

    public getCategoryGroupCollection (budgetId: string): AngularFirestoreCollection<CategoryGroup> {
        return this.afs.collection<CategoryGroup>(`budgets/${budgetId}/categoryGroups`);
    }
}

export interface CategoryGroup {
    name: string;
}

export interface CategoryGroupId extends CategoryGroup {
    groupId: string;
}

export interface Category {
    name: string;
    groupId: string;
}

export interface CategoryId extends Category {
    categoryId: string;
}

export interface BudgetId extends Budget {
    budgetId: string;
}

export interface Budget {
    userId: string;
    budgetName: string;
    currencyType: string;
}

export interface AccountId extends Account {
    budgetAccountId: string
}

export interface Account {
    userId: string,
    budgetId: string,
    accountName: string,
    accountType: string
}

