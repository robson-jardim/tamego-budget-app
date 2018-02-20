import { Injectable } from '@angular/core';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { MapFirestoreDocumentIdService } from '@shared/services/map-firestore-document-id/map-firestore-docoument-id.service';
import { CollectionResult } from '@models/collection-result.model';
import { ReoccurringTransaction, ReoccurringTransactionId, Transaction } from '@models/transaction.model';
import { ReoccurringTransfer, ReoccurringTransferId, Transfer } from '@models/transfer.model';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Observable } from 'rxjs/Observable';
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

            const now = this.utility.convertToUtc(new Date());

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

        const reoccurringTransferCollection = this.references.getReoccurringTransferCollectionRef(budgetId);
        const transferCollection = this.references.getTransferCollectionRef(budgetId);

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

        let transfers$: Observable<ReoccurringTransferId[]> = this.utility.combineLatestObj({
            origin: origin$,
            destination: destination$
        }).map(({origin, destination}) => {
            return [...origin, ...destination];
        });

        transfers$ = transfers$.do(reoccurringTransfers => {
            const now = this.utility.convertToUtc(new Date());

            reoccurringTransfers.map(reoccurringTransfer => {
                if (reoccurringTransfer.transactionDate < now) {
                    const utcString = this.utility.utcToString(reoccurringTransfer.transactionDate);
                    const newTransactionId = reoccurringTransfer.reoccurringTransferId + '_' + utcString;

                    const nonreoccurring: Transfer = {
                        transactionDate: reoccurringTransfer.transactionDate,
                        originAccountId: reoccurringTransfer.originAccountId,
                        destinationAccountId: reoccurringTransfer.destinationAccountId,
                        memo: reoccurringTransfer.memo,
                        amount: reoccurringTransfer.amount,
                        clearedOrigin: reoccurringTransfer.clearedOrigin,
                        clearedDestination: reoccurringTransfer.clearedDestination,
                        lockedOrigin: reoccurringTransfer.lockedOrigin,
                        lockedDestination: reoccurringTransfer.lockedDestination
                    };

                    const nextOccurrence = this.getNextOccurrence(reoccurringTransfer.transactionDate, reoccurringTransfer.reoccurringSchedule);

                    reoccurringTransferCollection.doc(reoccurringTransfer.reoccurringTransferId).update({transactionDate: nextOccurrence});
                    transferCollection.doc(newTransactionId).set({...nonreoccurring});
                }
            });
        });

        return {
            collection: reoccurringTransferCollection,
            observable: transfers$
        };

    }

    private getNextOccurrence(date: Date, schedule: ReoccurringSchedules): Date {
        // Copy the date object to not avoid manipulating the reference
        date = new Date(date.getTime());

        // Convert local time to UTC because the transaction dates are in UTC
        const now = this.utility.convertToUtc(new Date());

        if (ReoccurringSchedules.Daily === schedule) {
            do {
                this.nextDay(date);
            } while (date <= now);
        }
        else if (ReoccurringSchedules.Weekly === schedule) {
            do {
                this.nextWeek(date);
            } while (date <= now);
        }
        else if (ReoccurringSchedules.EveryOtherWeek === schedule) {
            do {
                this.everyOtherWeek(date);
            } while (date <= now);
        }
        else if (ReoccurringSchedules.Monthly === schedule) {
            do {
                this.nextMonth(date);
            } while (date <= now);
        }
        else if (ReoccurringSchedules.Yearly === schedule) {
            do {
                this.nextYear(date);
            } while (date <= now);
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
