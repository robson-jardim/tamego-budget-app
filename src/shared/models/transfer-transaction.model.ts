import { Reoccurring } from '@models/reoccuring.model';

export interface TransferTransaction {
    transactionDate: Date;
    originAccountId: string;
    destinationAccountId: string;
    memo: string | null;
    amount: number | null;
    clearedOrigin: boolean;
    clearedDestination: boolean;
    lockedOrigin: boolean;
    lockedDestination: boolean;
}

export interface TransferTransactionId extends TransferTransaction {
    transferTransactionId: string;
}

export interface ReoccurringTransferTransaction extends TransferTransaction, Reoccurring {
}

export interface ReoccurringTransferTransactionId extends ReoccurringTransferTransaction {
    reoccurringTransferTransactionId: string;
}

// Don't export to avoid confusion with instanceOfTransferTransactionId
function instanceOfTransferTransaction(obj: Object) {
    return obj && obj instanceof Object
        && 'transactionDate' in obj
        && 'originAccountId' in obj
        && 'destinationAccountId' in obj
        && 'memo' in obj
        && 'amount' in obj
        && 'clearedOrigin' in obj
        && 'clearedDestination' in obj
        && 'lockedOrigin' in obj
        && 'lockedDestination' in obj;
}

export function instanceOfTransferTransactionId(obj: Object) {
    return obj && obj instanceof Object
        && instanceOfTransferTransaction(obj)
        && 'transferTransactionId' in obj;
}

export function instanceOfReoccurringTransferTransactionId(obj: Object) {
    return obj && obj instanceof Object
        && instanceOfTransferTransaction(obj)
        && 'reoccurringSchedule' in obj
        && 'reoccurringTransferTransactionId' in obj;
}





