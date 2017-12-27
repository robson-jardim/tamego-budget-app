export interface CategoryValue {
    categoryId: string;
    budgeted: number;
    offset: number;
    budgetMonth: Date;
}

export interface CategoryValueId extends CategoryValue {
    categoryValueId: string;
}
