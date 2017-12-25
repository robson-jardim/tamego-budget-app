export interface SplitTransaction {
    transactionId: string;
    payeeId: string | null;
    categoryId: string | null;
    memo: string | null;
    value: string | null;
    sign: boolean | null;
}

export interface SplitTransactionId extends SplitTransaction {
    splitTransactionId: string;
}
