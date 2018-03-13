import { Injectable } from '@angular/core';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { MapFirestoreDocumentIdService } from '@shared/services/map-firestore-document-id/map-firestore-docoument-id.service';
import { CollectionResult } from '@models/collection-result.model';
import { ReoccurringTransaction, ReoccurringTransactionId, Transaction } from '@models/transaction.model';
import { ReoccurringTransfer, ReoccurringTransferId, Transfer } from '@models/transfer.model';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Observable } from 'rxjs/Observable';
import { ReoccurringSchedules } from '@shared/enums/reoccurring-schedules.enum';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class ReoccurringService {

    constructor(private mapDocumentId: MapFirestoreDocumentIdService,
                private references: FirestoreReferenceService,
                private utility: UtilityService,
                private afs: AngularFirestore) {
    }

    public getReoccurringTransactions(budgetId: string, accountId: string): CollectionResult<ReoccurringTransaction, ReoccurringTransactionId[]> {
        const reoccurringTransactionCollection = this.references.getReoccurringTransactionCollectionRef(budgetId, accountId);
        const transactionCollection = this.references.getTransactionCollectionRef(budgetId);
        let reoccurringTransactions$: Observable<ReoccurringTransactionId[]> = this.mapDocumentId.mapReoccurringTransactionIds(reoccurringTransactionCollection);

        reoccurringTransactions$ = reoccurringTransactions$.do(reoccurringTransactions => {

            let today = new Date();
            today = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

            const batch = this.afs.firestore.batch();

            reoccurringTransactions.map(reoccurringTransaction => {
                if (reoccurringTransaction.transactionDate <= today) {
                    const nonreoccurring: Transaction = {
                        transactionDate: reoccurringTransaction.transactionDate,
                        accountId: reoccurringTransaction.accountId,
                        payeeId: reoccurringTransaction.payeeId,
                        categoryId: reoccurringTransaction.categoryId,
                        splits: reoccurringTransaction.splits,
                        memo: reoccurringTransaction.memo,
                        amount: reoccurringTransaction.amount,
                        cleared: false,
                        locked: false
                    };


                    const reoccurringDocRef = reoccurringTransactionCollection.doc(reoccurringTransaction.reoccurringTransactionId).ref;
                    const nextOccurrence = this.getNextOccurrence(reoccurringTransaction.transactionDate, reoccurringTransaction.reoccurringSchedule);

                    batch.update(reoccurringDocRef, {
                        transactionDate: nextOccurrence,
                        cleared: false,
                        locked: false
                    });

                    const newTransactionId = this.afs.createId();
                    const newTransactionDocRef = transactionCollection.doc(newTransactionId).ref;

                    batch.set(newTransactionDocRef, {...nonreoccurring});

                }

                batch.commit();

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

            let today = new Date();
            today = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

            const batch = this.afs.firestore.batch();

            reoccurringTransfers.map(reoccurringTransfer => {

                if (reoccurringTransfer.transactionDate <= today) {

                    const nonreoccurring: Transfer = {
                        transactionDate: reoccurringTransfer.transactionDate,
                        originAccountId: reoccurringTransfer.originAccountId,
                        destinationAccountId: reoccurringTransfer.destinationAccountId,
                        memo: reoccurringTransfer.memo,
                        amount: reoccurringTransfer.amount,
                        clearedOrigin: false,
                        clearedDestination: false,
                        lockedOrigin: false,
                        lockedDestination: false
                    };

                    const reoccurringDocRef = reoccurringTransferCollection.doc(reoccurringTransfer.reoccurringTransferId).ref;
                    const nextOccurrence = this.getNextOccurrence(reoccurringTransfer.transactionDate, reoccurringTransfer.reoccurringSchedule);
                    batch.update(reoccurringDocRef, {
                        transactionDate: nextOccurrence,
                        clearedOrigin: false,
                        clearedDestination: false,
                        lockedOrigin: false,
                        lockedDestination: false
                    });

                    const newTransferId = this.afs.createId();
                    const newTransferRef = transferCollection.doc(newTransferId).ref;
                    batch.set(newTransferRef, {...nonreoccurring});

                }

                batch.commit();

            });
        });

        return {
            collection: reoccurringTransferCollection,
            observable: transfers$
        };

    }

    private getNextOccurrence(utcDate: Date, schedule: ReoccurringSchedules): Date {
        // Copy the date object to not avoid manipulating the original object reference
        utcDate = new Date(utcDate.getTime());

        // Convert local time to UTC because the transaction dates are in UTC
        const today = this.utility.convertToUtc(new Date());

        if (ReoccurringSchedules.Daily === schedule) {
            do {
                this.nextDay(utcDate);
            } while (utcDate <= today);
        }
        else if (ReoccurringSchedules.Weekly === schedule) {
            do {
                this.nextWeek(utcDate);
            } while (utcDate <= today);
        }
        else if (ReoccurringSchedules.EveryOtherWeek === schedule) {
            do {
                this.everyOtherWeek(utcDate);
            } while (utcDate <= today);
        }
        else if (ReoccurringSchedules.Monthly === schedule) {
            do {
                this.nextMonth(utcDate);
            } while (utcDate <= today);
        }
        else if (ReoccurringSchedules.Yearly === schedule) {
            do {
                this.nextYear(utcDate);
            } while (utcDate <= today);
        }
        else {
            throw new Error('Unable to find next reoccurring occurrence');
        }

        return utcDate;
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
