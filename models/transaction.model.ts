export interface Transaction {
    accountId: string;
    date: Date;
    payeeId: string | null;
    categoryId: string | null;
    memo: string | null;
    value: string | null;
    sign: boolean | null;
    status: string;
}

export interface TransactionId extends Transaction {
    transactionId: string;
}
