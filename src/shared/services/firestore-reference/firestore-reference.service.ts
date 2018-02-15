import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Budget } from '@models/budget.model';
import { BudgetAccount } from '@models/budget-account.model';
import { CategoryGroup } from '@models/category-group.model';
import { Category } from '@models/category.model';
import { CategoryValue } from '@models/category-value.model';
import { Transaction } from '@models/transaction.model';
import { TransferTransaction } from '@models/transfer-transaction.model';
import { Payee } from '@models/payee.model';

@Injectable()
export class FirestoreReferenceService {

    constructor(private afs: AngularFirestore) {
    }

    public getBudgetCollectionRef(userId): AngularFirestoreCollection<Budget> {
        return this.afs.collection<Budget>('budgets', ref =>
            ref.where('userId', '==', userId)
                .orderBy('lastVisited', 'desc'));
    }

    public getAccountsCollectionRef(budgetId: string): AngularFirestoreCollection<BudgetAccount> {
        return this.afs.collection<BudgetAccount>(`budgets/${budgetId}/accounts`);
    }

    public getGroupsCollectionRef(budgetId: string): AngularFirestoreCollection<CategoryGroup> {
        return this.afs.collection<CategoryGroup>(`budgets/${budgetId}/categoryGroups`, ref =>
            ref.orderBy('position', 'asc')
        );
    }

    public getCategoriesCollectionRef(budgetId: string): AngularFirestoreCollection<Category> {
        return this.afs.collection<Category>(`budgets/${budgetId}/categories`, ref =>
            ref.orderBy('position', 'asc')
        );
    }

    public getCategoryValuesCollectionRef(budgetId: string): AngularFirestoreCollection<CategoryValue> {
        return this.afs.collection<CategoryValue>(`budgets/${budgetId}/categoryValues`, ref =>
            ref.orderBy('budgetMonth', 'asc')
        );
    }

    public getTransactionCollectionRef(budgetId: string, accountId?: string) {
        return this.afs.collection<Transaction>(`budgets/${budgetId}/transactions`, ref => {
            let query: any = ref;

            if (accountId) {
                query = query.where('accountId', '==', accountId);
            }

            return query;
        });
    }

    public getOriginTransfersCollectionRef(budgetId: string, accountId: string): AngularFirestoreCollection<TransferTransaction> {
        return this.afs.collection(`budgets/${budgetId}/transferTransactions`, ref => {
            return ref.where('originAccountId', '==', accountId);
        });
    }

    public getDestinationTransfersCollectionRef(budgetId: string, accountId: string): AngularFirestoreCollection<TransferTransaction> {
        return this.afs.collection(`budgets/${budgetId}/transferTransactions`, ref => {
            return ref.where('destinationAccountId', '==', accountId);
        });
    }

    public getTransfers(budgetId: string): AngularFirestoreCollection<TransferTransaction> {
        return this.afs.collection(`budgets/${budgetId}/transferTransactions`);
    }

    public getPayeeCollectionRef(budgetId: string): AngularFirestoreCollection<Payee> {
        return this.afs.collection(`budgets/${budgetId}/payees`, ref => {
            return ref.orderBy('payeeName', 'asc');
        });
    }

    public getReoccurringTransactionCollectionRef(budgetId: string, accountId?: string) {
        return this.afs.collection<Transaction>(`budgets/${budgetId}/reoccurringTransactions`, ref => {
            let query: any = ref;

            if (accountId) {
                query = query.where('accountId', '==', accountId);
            }

            return query;
        });
    }
}



