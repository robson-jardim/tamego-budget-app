import { Reoccurring } from '@models/reoccuring.model';

export interface Transfer {
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

export interface TransferId extends Transfer {
    transferId: string;
}

// Don't export to avoid confusion with instanceOfTransferId
function instanceOfTransfer(obj: Object) {
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

export function instanceOfTransferId(obj: Object) {
    return obj && obj instanceof Object
        && instanceOfTransfer(obj)
        && 'transferId' in obj;
}

export interface ReoccurringTransfer extends Transfer, Reoccurring {
}

export interface ReoccurringTransferId extends ReoccurringTransfer {
    reoccurringTransferId: string;
}

export function instanceOfReoccurringTransferId(obj: Object) {
    return obj && obj instanceof Object
        && instanceOfTransfer(obj)
        && 'reoccurringSchedule' in obj
        && 'reoccurringTransferId' in obj;
}





