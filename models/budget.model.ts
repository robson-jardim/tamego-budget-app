export interface Budget {
    userId: string;
    budgetName: string;
    currencyType: string;
}

export interface BudgetId extends Budget {
    budgetId: string;
}
