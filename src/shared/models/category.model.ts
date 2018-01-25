export interface Category {
    groupId: string;
    categoryName: string;
    position: number;
}

export interface CategoryId extends Category {
    categoryId: string;
}

export function instanceOfCategoryId(obj: Object) {
    return obj && obj instanceof Object
        && 'categoryId' in obj
        && 'groupId' in obj
        && 'categoryName' in obj
        && 'position' in obj;
}

