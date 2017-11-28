import { CollectionResult } from './collection-result.model';

export interface Category {
    groupId: string;
    categoryName: string;
}

export interface CategoryId extends Category {
    categoryId: string;
}
