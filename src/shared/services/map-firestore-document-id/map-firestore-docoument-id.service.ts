import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CategoryGroup, CategoryGroupId } from '@models/category-group.model';
import { Category, CategoryId } from '@models/category.model';
import { Account, AccountId } from '@models/budget-account.model';
import { Budget, BudgetId } from '@models/budget.model';
import { CategoryValue, CategoryValueId } from '@models/category-value.model';
import {
    ReoccurringTransaction,
    ReoccurringTransactionId,
    Transaction,
    TransactionId
} from '@models/transaction.model';
import { ReoccurringTransferId, Transfer, TransferId } from '@models/transfer.model';
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

    public mapBudgetAccountIds(collection: AngularFirestoreCollection<Account>): Observable<AccountId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const account: AccountId = this.getDocData<AccountId>(a);
                account.accountId = this.getDocId(a);
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

    public mapTransferIds(collection: AngularFirestoreCollection<Transfer>): Observable<TransferId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const transfer: TransferId = this.getDocData<TransferId>(a);
                transfer.transferId = this.getDocId(a);
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

    mapReoccurringTransferIds(collection: AngularFirestoreCollection<Transfer>): Observable<ReoccurringTransferId[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const transaction: ReoccurringTransferId = this.getDocData<ReoccurringTransferId>(a);
                transaction.reoccurringTransferId = this.getDocId(a);
                return transaction;
            });
        });
    }
}
