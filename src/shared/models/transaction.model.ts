import { Reoccurring } from '@models/reoccuring.model';
import { ReoccurringTransferId, TransferId } from '@models/transfer.model';

export type TransactionType = TransactionId | ReoccurringTransactionId | TransferId | ReoccurringTransferId;

export interface Transaction {
    transactionDate: Date;
    accountId: string;
    payeeId: string | null;
    categoryId: string | null;
    splits: SplitTransaction[];
    memo: string | null;
    amount: number | null;
    cleared: boolean;
    locked: boolean;
}

export interface SplitTransaction {
    categoryId: string;
    amount: number | null;
}

export interface TransactionId extends Transaction {
    transactionId: string;
}

export interface ReoccurringTransaction extends Transaction, Reoccurring {
}

export interface ReoccurringTransactionId extends ReoccurringTransaction {
    reoccurringTransactionId: string;
}

// Don't export to avoid confusion with instanceOfTransactionId
function instanceOfTransaction(obj: Object) {
    return obj && obj instanceof Object
        && 'transactionDate' in obj
        && 'accountId' in obj
        && 'payeeId' in obj
        && 'categoryId' in obj
        && 'splits' in obj
        && 'memo' in obj
        && 'amount' in obj
        && 'cleared' in obj
        && 'locked' in obj;
}

export function instanceOfTransactionId(obj: Object) {
    return obj && obj instanceof Object
        && instanceOfTransaction(obj)
        && 'transactionId' in obj;
}

export function instanceOfReoccurringTransactionId(obj: Object) {
    return obj && obj instanceof Object
        && instanceOfTransaction(obj)
        && 'reoccurringSchedule' in obj
        && 'reoccurringTransactionId' in obj;
}

