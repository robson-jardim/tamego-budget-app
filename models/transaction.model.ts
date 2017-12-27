export interface Transaction {
    transactionDate: Date;
    accountId: string;
    payeeId: string | null;
    categoryId: string | null;
    memo: string | null;
    amount: number | null;
    status: number;
}

export interface TransactionId extends Transaction {
    transactionId: string;
}
