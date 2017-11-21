export interface BudgetAccount {
    userId: string;
    budgetId: string;
    accountName: string;
    accountType: string;
}

export interface BudgetAccountId extends BudgetAccount {
    budgetAccountId: string;
}
