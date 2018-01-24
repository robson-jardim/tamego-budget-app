export interface BudgetAccount {
    accountName: string;
    accountType: string;
}

export interface BudgetAccountId extends BudgetAccount {
    budgetAccountId: string;
}

export function instanceOfBudgetAccountId(obj: Object) {
    return 'budgetAccountId' in obj
        && 'accountName' in obj
        && 'accountType' in obj;
}
