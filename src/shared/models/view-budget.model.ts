import { CategoryGroupId } from '@models/category-group.model';
import { CategoryValueId } from '@models/category-value.model';
import { CategoryId } from '@models/category.model';

export interface GroupWithCategories extends CategoryGroupId {
    categories: CategoryId[];
}

export interface GroupWithCategoriesWithValues extends CategoryGroupId {
    categories: CategoryWithValues[];
}

export interface CategoryWithValues extends CategoryId {
    values: CategoryValueId[];
}

