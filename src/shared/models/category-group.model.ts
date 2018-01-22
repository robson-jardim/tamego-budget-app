import { CollectionResult } from './collection-result.model';
import { Category, CategoryId } from './category.model';
import { AngularFirestoreCollection } from 'angularfire2/firestore';

export interface CategoryGroup {
    groupName: string;
    position: number;
}

export interface CategoryGroupId extends CategoryGroup {
    groupId: string;
}