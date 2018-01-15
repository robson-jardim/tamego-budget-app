export interface TransferTransaction {
    transactionDate: Date;
    originAccountId: string;
    destinationAccountId: string;
    memo?: string;
    amount?: number;
    status: number;
}

export interface TransferTransactionId extends TransferTransaction {
    transferTransactionId: string;
}
