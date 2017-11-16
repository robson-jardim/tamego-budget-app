import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { AuthGuard } from "../auth-guard/auth.guard";
import { ObjectUnsubscribedError } from "rxjs/Rx";

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
                return {budgetId, ...data};
            });
        });

        return budgets;
    }

    public getBudgetAccountCollection(budgetId: string): AngularFirestoreCollection<BudgetAccount> {
        const budgetAccountCollection = this.afs.collection<BudgetAccount>('budgetAccounts', ref =>
            ref.where('userId', '==', this.userId)
                .where('budgetId', '==', budgetId)
        );

        return budgetAccountCollection;
    }

    public getBudgetAccountsWithIds(budgetAccountCollection: AngularFirestoreCollection<BudgetAccount>): Observable<BudgetAccountId[]> {
        const budgetAccounts = budgetAccountCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as BudgetAccount;
                const budgetAccountId = a.payload.doc.id;
                return {budgetAccountId, ...data};
            });
        });

        return budgetAccounts;
    }
}

export interface BudgetId extends Budget {
    budgetId: string;
}

export interface Budget {
    userId: string;
    budgetName: string;
    currencyType: string;
}

export interface BudgetAccountId extends BudgetAccount {
    budgetAccountId: string
}

export interface BudgetAccount {
    userId: string,
    budgetId: string,
    accountName: string,
    accountType: string
}

