export interface Payee {
    payeeName: string;
}

export interface PayeeId extends Payee {
    payeeId: string;
}

export function instanceOfPayeeId(obj: Object) {
    return obj && obj instanceof Object
        && 'payeeId' in obj
        && 'payeeName' in obj;
}
