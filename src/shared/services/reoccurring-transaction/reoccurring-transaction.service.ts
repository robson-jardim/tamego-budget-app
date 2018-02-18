import { Injectable } from '@angular/core';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { MapFirestoreDocumentIdService } from '@shared/services/map-firestore-document-id/map-firestore-docoument-id.service';
import { CollectionResult } from '@models/collection-result.model';
import { ReoccurringTransaction, ReoccurringTransactionId } from '@models/transaction.model';

@Injectable()
export class ReoccurringTransactionService {

    constructor(private mapDocumentId: MapFirestoreDocumentIdService,
                private references: FirestoreReferenceService,) {
    }

    public getReoccurringTransactions(budgetId: string, accountId: string): CollectionResult<ReoccurringTransaction, ReoccurringTransactionId[]> {
        const collection = this.references.getReoccurringTransactionCollectionRef(budgetId, accountId);
        const observable = this.mapDocumentId.mapReoccurringTransactionIds(collection);
        return {collection, observable};
    }

    public getReoccurringTransferTransaction() {
        return true;
    }

}
