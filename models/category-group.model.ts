import { Category, CategoryId } from './category.model';
import { CollectionResult } from './collection-result.model';

export interface CategoryGroup {
    groupName: string;
}

export interface CategoryGroupId extends CategoryGroup {
    groupId: string;
}

export interface GroupAndCategories extends CategoryGroupId {
    categories: CollectionResult<Category, CategoryId[]>;
}
