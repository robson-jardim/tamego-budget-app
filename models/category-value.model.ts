export interface CategoryValue {
    categoryId: string;
    year: number;
    month: number;
    budgetedAmount: number;
    offset: number;
}

export interface CategoryValueId extends CategoryValue {
    categoryValueId: string;
}
