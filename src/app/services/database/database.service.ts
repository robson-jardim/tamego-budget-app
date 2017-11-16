import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { AuthGuard } from "../auth-guard/auth.guard";

@Injectable()
export class DatabaseService {

    public readonly userId: string;

    constructor (private afs: AngularFirestore,
                 private authGuard: AuthGuard) {
        this.userId = this.authGuard.userId;
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

    public getBudgetAccountCollection (budgetId: string): AngularFirestoreCollection<BudgetAccount> {
        const budgetAccountCollection = this.afs.collection<BudgetAccount>('budgetAccount', ref =>
            ref.where('userId', '==', this.userId)
                .where('budgetId', '==', budgetId)
        );

        return budgetAccountCollection;
    }

}


export interface Budget {
    userId: string;
    budgetName: string;
    currencyType: string;
}

export interface BudgetId extends Budget {
    budgetId: string;
}

export interface BudgetAccount {
    accountName: string,
    accountType: string
}

