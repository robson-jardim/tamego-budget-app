import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
    instanceOfReoccurringTransactionId, instanceOfTransactionId, ReoccurringTransactionId, TransactionId,
    TransactionType
} from '@models/transaction.model';
import {
    instanceOfReoccurringTransferId, instanceOfTransferId, ReoccurringTransferId,
    TransferId
} from '@models/transfer.model';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
    selector: 'app-reconcile-dialog',
    templateUrl: './reconcile-dialog.component.html',
    styleUrls: ['./reconcile-dialog.component.scss']
})
export class ReconcileConfirmDialogComponent implements OnInit {

    public accountBalance;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private dialogRef: MatDialogRef<ReconcileConfirmDialogComponent>,
                private afs: AngularFirestore) {
    }

    private isCleared = (x) => x.cleared || x.clearedDestination || x.clearedOrigin;
    private amount = (x) => x.amount;
    private sum = (total, curr) => total + curr;

    ngOnInit() {
        this.accountBalance = this.data.transactions
            .filter(this.isCleared)
            .map(this.amount)
            .reduce(this.sum, 0);
    }

    public lockedClearedTransactions() {
        const batch = this.afs.firestore.batch();
        const budgetPath = this.afs.doc(`budgets/${this.data.budgetId}`).ref.path;

        const validTransactions: Array<TransactionType> = this.data.transactions
            .filter(this.isCleared);

        validTransactions.forEach(transaction => {

            let transactionRef;

            if (instanceOfTransactionId(transaction)) {
                transaction = transaction as TransactionId;
                transactionRef = this.afs.doc(budgetPath + '/transactions/' + transaction.transactionId).ref;
                batch.update(transactionRef, {locked: true});
            }
            else if (instanceOfReoccurringTransactionId(transaction)) {
                transaction = transaction as ReoccurringTransactionId;
                transactionRef = this.afs.doc(budgetPath + '/reoccurringTransactions/' + transaction.reoccurringTransactionId).ref;
                batch.update(transactionRef, {locked: true});
            }
            else if (instanceOfTransferId(transaction)) {
                transaction = transaction as TransferId;
                transactionRef = this.afs.doc(budgetPath + '/transfers/' + transaction.transferId).ref;
                batch.update(transactionRef, {
                    lockedOrigin: true,
                    lockedDestination: true
                });
            }
            else if (instanceOfReoccurringTransferId(transaction)) {
                transaction = transaction as ReoccurringTransferId;
                transactionRef = this.afs.doc(budgetPath + '/reoccurringTransfers/' + transaction.reoccurringTransferId).ref;
                batch.update(transactionRef, {
                    lockedOrigin: true,
                    lockedDestination: true
                });
            }
            else {
                throw new Error('Unable to determine transaction state');
            }
        });

        batch.commit();
        this.dialogRef.close();
    }
}
