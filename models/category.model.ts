import { CollectionResult } from './collection-result.model';

export interface Category {
    groupId: string;
    categoryName: string;
    position: number;
}

export interface CategoryId extends Category {
    categoryId: string;
}
