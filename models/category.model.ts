import { CollectionResult } from './collection-result.model';

export interface Category {
    categoryName: string;
}

export interface CategoryId extends Category {
    categoryId: string;
}
