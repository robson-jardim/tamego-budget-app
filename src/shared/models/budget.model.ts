export interface Budget {
    userId: string;
    budgetName: string;
    currencyCode: CurrencyCode;
    timeCreated: Date;
    lastModified: Date;
}

type CurrencyCode = string;

export interface BudgetId extends Budget {
    budgetId: string;
}

