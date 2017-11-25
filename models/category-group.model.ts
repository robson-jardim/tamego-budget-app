import { Category } from './category.model';
import { FirestoreResult } from './firestore-result.model';

export interface CategoryGroup {
    groupName: string;
}

export interface CategoryGroupId {
    groupId: string;
}

export interface GroupAndCategories extends CategoryGroupId {
    categories: FirestoreResult<Category>;
}
