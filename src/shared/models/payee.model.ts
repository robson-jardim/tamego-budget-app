export interface Payee {
    payeeName: string;
    belongToCategoryId: string;
}

export interface PayeeId extends Payee {
    payeeId: string;
}
