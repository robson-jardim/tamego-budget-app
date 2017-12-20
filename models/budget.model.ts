export interface Budget {
    userId: string;
    budgetName: string;
    createdAt: Date;
}

export interface BudgetId extends Budget {
    budgetId: string;
}
