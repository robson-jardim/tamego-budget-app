import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CategoryGroup, CategoryGroupId } from '@models/category-group.model';
import { Category, CategoryId } from '@models/category.model';
import { BudgetAccount, BudgetAccountId } from '@models/budget-account.model';
import { BudgetId, Budget } from '@models/budget.model';
import { CategoryValue, CategoryValueId } from '@models/category-value.model';
import {
    ReoccurringTransaction, ReoccurringTransactionId, Transaction,
    TransactionId
} from '@models/transaction.model';
import { TransferTransaction, TransferTransactionId } from '@models/transfer-transaction.model';
import { Payee, PayeeId } from '@models/payee.model';

@Injectable()
export class MapFirestoreDocumentIdService {

    constructor() {
    }

    private getDocData<T>(action: DocumentChangeAction) {
        return action.payload.doc.data() as T;
    }

    private getDocId(action: DocumentChangeAction) {
        return action.payload.doc.id;
    }

    public mapBudgetIds(collection: AngularFirestoreCollection<Budget>): Observable<BudgetId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const budget: BudgetId = this.getDocData<BudgetId>(a);
                budget.budgetId = this.getDocId(a);
                return budget;
            });
        });
    }

    public mapBudgetAccountIds(collection: AngularFirestoreCollection<BudgetAccount>): Observable<BudgetAccountId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const account: BudgetAccountId = this.getDocData<BudgetAccountId>(a);
                account.budgetAccountId = this.getDocId(a);
                return account;
            });
        });
    }

    public mapCategoryGroupIds(collection: AngularFirestoreCollection<CategoryGroup>): Observable<CategoryGroupId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const categoryGroup: CategoryGroupId = this.getDocData<CategoryGroupId>(a);
                categoryGroup.groupId = this.getDocId(a);
                return categoryGroup;
            });
        });
    }

    public mapCategoryIds(collection: AngularFirestoreCollection<Category>): Observable<CategoryId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const category: CategoryId = this.getDocData<CategoryId>(a);
                category.categoryId = this.getDocId(a);
                return category;
            });
        });
    }

    public mapCategoryValueIds(collection: AngularFirestoreCollection<CategoryValue>): Observable<CategoryValueId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const value: CategoryValueId = this.getDocData<CategoryValueId>(a);
                value.categoryValueId = this.getDocId(a);
                return value;
            });
        });
    }

    public mapTransactionIds(collection: AngularFirestoreCollection<Transaction>) {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const transaction: TransactionId = this.getDocData<TransactionId>(a);
                transaction.transactionId = this.getDocId(a);
                return transaction;
            });
        });
    }

    public mapTransferTransactionIds(collection: AngularFirestoreCollection<TransferTransaction>): Observable<TransferTransactionId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const transfer: TransferTransactionId = this.getDocData<TransferTransactionId>(a);
                transfer.transferTransactionId = this.getDocId(a);
                return transfer;
            });
        });
    }

    public mapPayeeIds(collection: AngularFirestoreCollection<Payee>): Observable<PayeeId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const payee: PayeeId = this.getDocData<PayeeId>(a);
                payee.payeeId = this.getDocId(a);
                return payee;
            });
        });
    }

    public mapReoccurringTransactionIds(collection: AngularFirestoreCollection<ReoccurringTransaction>): Observable<ReoccurringTransactionId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const transaction: ReoccurringTransactionId = this.getDocData<ReoccurringTransactionId>(a);
                transaction.reoccurringTransactionId = this.getDocId(a);
                return transaction;
            });
        });
    }
}
