export interface CategoryValue {
    categoryId: string;
    budgeted: number;
    offset: number;
    time: Date;
}

export interface CategoryValueId extends CategoryValue {
    categoryValueId: string;
}
