export interface BudgetAccount {
    accountName: string;
    createdAt: Date;
}

export interface BudgetAccountId extends BudgetAccount {
    budgetAccountId: string;
}

export function instanceOfBudgetAccountId(obj: Object) {
    return obj && obj instanceof Object
        && 'budgetAccountId' in obj
        && 'accountName' in obj
        && 'createdAt' in obj;
}
