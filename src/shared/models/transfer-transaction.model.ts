export interface TransferTransaction {
    transactionDate: Date;
    originAccountId: string;
    destinationAccountId: string;
    memo: string | null;
    amount: number | null;
    cleared: boolean;
    locked: boolean;
}

export interface TransferTransactionId extends TransferTransaction {
    transferTransactionId: string;
}

export function instanceOfTransfer(obj: Object) {
    return obj && obj instanceof Object
        && 'transactionDate' in obj
        && 'originAccountId' in obj
        && 'destinationAccountId' in obj
        && 'memo' in obj
        && 'amount' in obj
        && 'cleared' in obj
        && 'locked' in obj;
}
