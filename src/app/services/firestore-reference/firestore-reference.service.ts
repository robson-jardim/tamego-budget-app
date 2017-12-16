import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { CategoryGroup } from '../../../../models/category-group.model';
import { Category } from '../../../../models/category.model';
import { Budget } from '../../../../models/budget.model';
import { BudgetAccount } from '../../../../models/budget-account.model';

@Injectable()
export class FirestoreReferenceService {

    constructor(private afs: AngularFirestore) {
    }

    public getBudgetCollectionRef(userId): AngularFirestoreCollection<Budget> {
        return this.afs.collection<Budget>('budgets', ref =>
            ref.where('userId', '==', userId));
    }

    public getBudgetAccountCollectionRef(budgetId: string): AngularFirestoreCollection<BudgetAccount> {
        return this.afs.collection<BudgetAccount>(`budgets/${budgetId}/accounts`);
    }

    public getCategoryGroupCollectionRef(budgetId: string): AngularFirestoreCollection<CategoryGroup> {
        return this.afs.collection<CategoryGroup>(`budgets/${budgetId}/categoryGroups`);
    }

    public getCategoryCollectionRef(budgetId: string): AngularFirestoreCollection<Category> {
        return this.afs.collection<Category>(`budgets/${budgetId}/categories`);
    }

}



