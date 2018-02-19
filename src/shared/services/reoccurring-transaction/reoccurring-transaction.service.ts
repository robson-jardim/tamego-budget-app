import { Injectable } from '@angular/core';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { MapFirestoreDocumentIdService } from '@shared/services/map-firestore-document-id/map-firestore-docoument-id.service';
import { CollectionResult } from '@models/collection-result.model';
import { ReoccurringTransaction, ReoccurringTransactionId } from '@models/transaction.model';
import { ReoccurringTransfer, ReoccurringTransferId } from '@models/transfer-transaction.model';
import { UtilityService } from '@shared/services/utility/utility.service';

@Injectable()
export class ReoccurringTransactionService {

    constructor(private mapDocumentId: MapFirestoreDocumentIdService,
                private references: FirestoreReferenceService,
                private utility: UtilityService) {
    }

    public getReoccurringTransactions(budgetId: string, accountId: string): CollectionResult<ReoccurringTransaction, ReoccurringTransactionId[]> {
        const collection = this.references.getReoccurringTransactionCollectionRef(budgetId, accountId);
        const observable = this.mapDocumentId.mapReoccurringTransactionIds(collection);
        return {collection, observable};
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
