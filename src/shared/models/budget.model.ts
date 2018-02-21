export interface Budget {
    userId: string;
    budgetName: string;
    timeCreated: Date;
    lastVisited: Date;
}

export interface BudgetId extends Budget {
    budgetId: string;
}

