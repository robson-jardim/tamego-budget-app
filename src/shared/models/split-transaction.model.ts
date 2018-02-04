export interface SplitTransaction {
    categoryId: string | null;
    amount: number | null;
}

export function instanceOfTransaction(obj: Object) {
    return obj && obj instanceof Object
        && 'categoryId' in obj
        && 'amount' in obj;
}
