import { Injectable } from '@angular/core';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { MapFirestoreDocumentIdService } from '@shared/services/map-firestore-document-id/map-firestore-docoument-id.service';
import { CollectionResult } from '@models/collection-result.model';
import {
    ReoccurringTransaction, ReoccurringTransactionId, SplitTransaction,
    Transaction
} from '@models/transaction.model';
import { ReoccurringTransfer, ReoccurringTransferId } from '@models/transfer-transaction.model';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReoccurringTransactionService {

    constructor(private mapDocumentId: MapFirestoreDocumentIdService,
                private references: FirestoreReferenceService,
                private utility: UtilityService) {
    }

    public getReoccurringTransactions(budgetId: string, accountId: string): CollectionResult<ReoccurringTransaction, ReoccurringTransactionId[]> {
        const reoccurringTransactionCollection = this.references.getReoccurringTransactionCollectionRef(budgetId, accountId);
        const transactionCollection = this.references.getTransactionCollectionRef(budgetId);
        let reoccurringTransactions$: Observable<ReoccurringTransactionId[]> = this.mapDocumentId.mapReoccurringTransactionIds(reoccurringTransactionCollection);

        reoccurringTransactions$ = reoccurringTransactions$.do(reoccurringTransactions => {

            const now = new Date();

            reoccurringTransactions.map(transaction => {
                if (transaction.transactionDate < now) {
                    const utcString = this.utility.utcToString(transaction.transactionDate);
                    const newTransactionId = transaction.reoccurringTransactionId + '_' + utcString;

                    const nonreoccurring: Transaction = {
                        transactionDate: transaction.transactionDate,
                        accountId: transaction.accountId,
                        payeeId: transaction.payeeId,
                        categoryId: transaction.categoryId,
                        splits: transaction.splits,
                        memo: transaction.memo,
                        amount: transaction.amount,
                        cleared: transaction.cleared,
                        locked: transaction.locked
                    };

                    transactionCollection.doc(newTransactionId).set({...nonreoccurring});
                    // reoccurringTransactionCollection.doc(transaction.reoccurringTransactionId).update({transactionDate: '1'});
                }
            });
        });

        return {
            collection: reoccurringTransactionCollection,
            observable: reoccurringTransactions$
        };
    }

    public getReoccurringTransfers(budgetId: string, accountId: string): CollectionResult<ReoccurringTransfer, ReoccurringTransferId[]> {

        const collection = this.references.getReoccurringTransferCollectionRef(budgetId);

        const originCollection = this.references.getReoccurringTransferCollectionRef(budgetId, {
            accountId,
            findByAccountProperty: 'originAccountId'
        });
        const destinationCollection = this.references.getReoccurringTransferCollectionRef(budgetId, {
            accountId,
            findByAccountProperty: 'destinationAccountId'
        });

        const origin$ = this.mapDocumentId.mapReoccurringTransferIds(originCollection);
        const destination$ = this.mapDocumentId.mapReoccurringTransferIds(destinationCollection);

        const combinedTransfers = this.utility.combineLatestObj({
            origin: origin$,
            destination: destination$
        }).map(({origin, destination}) => {
            return [...origin, ...destination];
        });

        return {
            collection,
            observable: combinedTransfers
        };

    }

}
