import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthGuard } from '../auth-guard/auth.guard';

import { CategoryGroup } from '../../../../models/category-group.model';
import { Category } from '../../../../models/category.model';
import { Budget } from '../../../../models/budget.model';
import { BudgetAccount } from '../../../../models/budget-account.model';

@Injectable()
export class FirestoreReferenceService {

    public readonly userId: string;

    constructor(private afs: AngularFirestore,
                private authGuard: AuthGuard) {
        this.userId = this.authGuard.userId;
    }

    public getBudgetCollectionRef(): AngularFirestoreCollection<Budget> {
        return this.afs.collection<Budget>('budgets', ref =>
            ref.where('userId', '==', this.userId));
    }

    public getBudgetAccountCollectionRef(budgetId: string): AngularFirestoreCollection<BudgetAccount> {
        return this.afs.collection<BudgetAccount>(`budgets/${budgetId}/accounts`);
    }

    public getCategoryCollectionRef(budgetId: string, groupId: string): AngularFirestoreCollection<Category> {
        return this.afs.collection<Category>(`budgets/${budgetId}/categories`, ref =>
            ref.where('groupId', '==', groupId)
        );
    }

    public getCategoryGroupCollectionRef(budgetId: string): AngularFirestoreCollection<CategoryGroup> {
        return this.afs.collection<CategoryGroup>(`budgets/${budgetId}/categoryGroups`);
    }

    public getGeneralCategoryCollectionRef(budgetId: string) {
        //We need a generalized version of category collection because we want to be able to see
        //if any changes occur in the entire collection
        return this.afs.collection<Category>(`budgets/${budgetId}/categories`);
    }




}



