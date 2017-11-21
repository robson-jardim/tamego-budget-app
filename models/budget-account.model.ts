export interface BudgetAccount {
    accountName: string;
    accountType: string;
}

export interface BudgetAccountId extends BudgetAccount {
    budgetAccountId: string;
}
