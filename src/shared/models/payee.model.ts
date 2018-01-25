export interface Payee {
    payeeName: string;
    belongToCategoryId: string;
}

export interface PayeeId extends Payee {
    payeeId: string;
}

export function instanceOfPayeeId(obj: Object) {
    return obj && obj instanceof Object
        && 'payeeId' in obj
        && 'payeeName' in obj
        && 'belongToCategoryId' in obj;
}
