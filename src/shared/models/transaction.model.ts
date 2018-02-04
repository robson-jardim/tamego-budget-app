import { SplitTransaction } from '@models/split-transaction.model';

export interface Transaction {
    transactionDate: Date;
    accountId: string;
    payeeId: string | null;
    categoryId: string | null;
    memo: string | null;
    splits: Array<SplitTransaction>;
    amount: number | null;
    status: number;
}

export interface TransactionId extends Transaction {
    transactionId: string;
}

export function instanceOfTransaction(obj: Object) {
    return obj && obj instanceof Object
        && 'transactionDate' in obj
        && 'accountId' in obj
        && 'payeeId' in obj
        && 'categoryId' in obj
        && 'memo' in obj
        && 'amount' in obj
        && 'status' in obj;
}
