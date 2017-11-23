import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthGuard } from '../auth-guard/auth.guard';

import { CategoryGroup } from '../../../../models/category-group.model';
import { Category } from '../../../../models/category.model';
import { Budget } from '../../../../models/budget.model';
import { BudgetAccount } from '../../../../models/budget-account.model';
import { BudgetGroup } from '../../components/edit-budget/edit-budget.component';

@Injectable()
export class FirebaseReferenceService {
    
    public readonly userId: string;

    constructor(private afs: AngularFirestore,
        private authGuard: AuthGuard) {
        this.userId = this.authGuard.userId;
    }

    public getBudgetCollection(): AngularFirestoreCollection<Budget> {
        return this.afs.collection<Budget>('budgets', ref =>
            ref.where('userId', '==', this.userId));
    }

    public getBudgetAccountCollection(budgetId: string): AngularFirestoreCollection<BudgetAccount> {
        return this.afs.collection<BudgetAccount>(`budgets/${budgetId}/accounts`);
    }

    public getCategoryCollection(budgetId: string, groupId: string): AngularFirestoreCollection<Category> {
        return  this.afs.collection<Category>(`budgets/${budgetId}/groups/${groupId}/categories`)
    }

    public getCategoryGroupCollection(budgetId: string): AngularFirestoreCollection<CategoryGroup> {
        return this.afs.collection<CategoryGroup>(`budgets/${budgetId}/groups`);
    }
}



