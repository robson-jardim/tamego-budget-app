///<reference path="../../../../models/category-value.model.ts"/>
import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

import {CategoryGroup} from '../../../../models/category-group.model';
import {Category} from '../../../../models/category.model';
import {Budget} from '../../../../models/budget.model';
import {BudgetAccount} from '../../../../models/budget-account.model';
import {CategoryValue} from '../../../../models/category-value.model';
import {Transaction} from '../../../../models/transaction.model';
import * as firebase from 'firebase';
import {SplitTransaction} from '../../../../models/split-transaction.model';
import {TransferTransaction} from '../../../../models/transfer-transaction';

@Injectable()
export class FirestoreReferenceService {

    constructor(private afs: AngularFirestore) {
    }

    public getBudgetCollectionRef(userId): AngularFirestoreCollection<Budget> {
        return this.afs.collection<Budget>('budgets', ref =>
            ref.where('userId', '==', userId));
    }

    public getAccountCollectionRef(budgetId: string): AngularFirestoreCollection<BudgetAccount> {
        return this.afs.collection<BudgetAccount>(`budgets/${budgetId}/accounts`);
    }

    public getGroupCollectionRef(budgetId: string): AngularFirestoreCollection<CategoryGroup> {
        return this.afs.collection<CategoryGroup>(`budgets/${budgetId}/categoryGroups`, ref =>
            ref.orderBy('position', 'asc')
        );
    }

    public getCategoryCollectionRef(budgetId: string): AngularFirestoreCollection<Category> {
        return this.afs.collection<Category>(`budgets/${budgetId}/categories`, ref =>
            ref.orderBy('position', 'asc')
        );
    }

    public getCategoryValuesCollectionRef(budgetId: string): AngularFirestoreCollection<CategoryValue> {
        return this.afs.collection<CategoryValue>(`budgets/${budgetId}/categoryValues`, ref =>
            ref.orderBy('time', 'asc')
        );
    }

    public getTransactionCollectionRef(budgetId: string, accountId: string | undefined) {
        return this.afs.collection<Transaction>(`budgets/${budgetId}/transactions`, ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

            if (accountId) {
                query = query.where('accountId', '==', accountId);
            }

            return query;
        });
    }

    public getSplitTransactionCollectionRef(budgetId: string) {
        return this.afs.collection<SplitTransaction>(`budgets/${budgetId}/splitTransactions`);
    }

    public getOriginTransfers(budgetId: string, accountId: string): AngularFirestoreCollection<TransferTransaction> {
        return this.afs.collection(`budgets/${budgetId}/transferTransactions`, ref => {
            return ref.where('originAccountId', '==', accountId);
        });
    }

    public getDestinationTransfers(budgetId: string, accountId: string): AngularFirestoreCollection<TransferTransaction> {
        return this.afs.collection(`budgets/${budgetId}/transferTransactions`, ref => {
            return ref.where('destinationAccountId', '==', accountId);
        });
    }

    public getTransfers(budgetId: string, accountId: string): AngularFirestoreCollection<TransferTransaction> {
        return this.afs.collection(`budgets/${budgetId}/transferTransactions`);
    }
}



