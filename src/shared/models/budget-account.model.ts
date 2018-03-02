export interface Account {
    accountName: string;
    createdAt: Date;
}

export interface AccountId extends Account {
    accountId: string;
}

export function instanceOfAccountId(obj: Object) {
    return obj && obj instanceof Object
        && 'accountId' in obj
        && 'accountName' in obj
        && 'createdAt' in obj;
}
