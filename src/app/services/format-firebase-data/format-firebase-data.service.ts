import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CategoryGroup } from '../../../../models/category-group.model';
import { FirebaseReferenceService } from '../firebase-reference/firebase-reference.service';
import { Category } from '../../../../models/category.model';

export class FireStoreData<T> {
    collection: AngularFirestoreCollection<T>;
    observable: Observable<T[]>;
}

@Injectable()
export class FormatFirebaseDataService {

    constructor(private firebaseRef: FirebaseReferenceService) { }

    public assignIdsToDocumentsInCollection<T>(collection: AngularFirestoreCollection<T>): Observable<T[]> {
        return collection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data: any = a.payload.doc.data() as T;
                data.id = a.payload.doc.id;
                return data;
            })
        })
    }

    public combineGroupAndCategories(budgetId: string): Observable<CategoryGroup[]> {

        const groupCollection: AngularFirestoreCollection<CategoryGroup> = this.firebaseRef.getCategoryGroupCollection(budgetId);
        const groups: Observable<CategoryGroup[]> = this.assignIdsToDocumentsInCollection(groupCollection);

        return groups.map(groups => {
            return groups.map(group => {
                return {
                    id: group.id,
                    name: group.name
                }
            })
        })
    }
}

interface groupExtends extends CategoryGroup {
    category: FireStoreData<Category>
}
