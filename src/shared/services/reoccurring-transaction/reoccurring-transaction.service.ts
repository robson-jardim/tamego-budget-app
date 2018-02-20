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
import { Reoccurring } from '@models/reoccuring.model';
import { ReoccurringSchedules } from '@shared/enums/reoccurring-schedules.enum';

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

            reoccurringTransactions.map(reoccurringTransaction => {
                if (reoccurringTransaction.transactionDate < now) {
                    const utcString = this.utility.utcToString(reoccurringTransaction.transactionDate);
                    const newTransactionId = reoccurringTransaction.reoccurringTransactionId + '_' + utcString;

                    const nonreoccurring: Transaction = {
                        transactionDate: reoccurringTransaction.transactionDate,
                        accountId: reoccurringTransaction.accountId,
                        payeeId: reoccurringTransaction.payeeId,
                        categoryId: reoccurringTransaction.categoryId,
                        splits: reoccurringTransaction.splits,
                        memo: reoccurringTransaction.memo,
                        amount: reoccurringTransaction.amount,
                        cleared: reoccurringTransaction.cleared,
                        locked: reoccurringTransaction.locked
                    };

                    const nextOccurrence = this.getNextOccurrence(reoccurringTransaction.transactionDate, reoccurringTransaction.reoccurringSchedule);

                    reoccurringTransactionCollection.doc(reoccurringTransaction.reoccurringTransactionId).update({transactionDate: nextOccurrence});
                    transactionCollection.doc(newTransactionId).set({...nonreoccurring});
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

    private getNextOccurrence(date: Date, schedule: ReoccurringSchedules): Date {
        // Copy the date object to not avoid manipulating the reference
        date = new Date(date.getTime());

        if (ReoccurringSchedules.Daily === schedule) {
            this.nextDay(date);
        }
        else if (ReoccurringSchedules.Weekly === schedule) {
            this.nextWeek(date);
        }
        else if (ReoccurringSchedules.EveryOtherWeek === schedule) {
            this.everyOtherWeek(date);
        }
        else if (ReoccurringSchedules.Monthly === schedule) {
            this.nextMonth(date);
        }
        else if (ReoccurringSchedules.Yearly === schedule) {
            this.nextYear(date);
        }
        else {
            throw new Error('Unable to find next reoccurring occurrence');
        }

        return date;
    }

    private nextDay(date: Date) {
        date.setUTCDate(date.getUTCDate() + 1);
    }

    private nextWeek(date: Date) {
        date.setUTCDate(date.getUTCDate() + 7);
    }

    private everyOtherWeek(date: Date) {
        date.setUTCDate(date.getUTCDate() + 14);
    }

    private nextMonth(date: Date) {
        date.setUTCMonth(date.getUTCMonth() + 1);
    }

    private nextYear(date: Date) {
        date.setUTCFullYear(date.getUTCFullYear() + 1);
    }

}
