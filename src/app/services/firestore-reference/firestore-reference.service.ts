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
export class FirestoreReferenceService {

    public readonly userId: string;

    constructor(private firestore: AngularFirestore,
        private authGuard: AuthGuard) {
        this.userId = this.authGuard.userId;
    }

    public getBudgetCollectionRef(): AngularFirestoreCollection<Budget> {
        return this.firestore.collection<Budget>('budgets', ref =>
            ref.where('userId', '==', this.userId));
    }

    public getBudgetAccountCollectionRef(budgetId: string): AngularFirestoreCollection<BudgetAccount> {
        return this.firestore.collection<BudgetAccount>(`budgets/${budgetId}/accounts`);
    }

    public getCategoryCollectionRef(budgetId: string, groupId: string): AngularFirestoreCollection<Category> {
        return  this.firestore.collection<Category>(`budgets/${budgetId}/groups/${groupId}/categories`);
    }

    public getCategoryGroupCollectionRef(budgetId: string): AngularFirestoreCollection<CategoryGroup> {
        return this.firestore.collection<CategoryGroup>(`budgets/${budgetId}/groups`);
    }
}



