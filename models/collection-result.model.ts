import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection } from 'angularfire2/firestore';

export class CollectionResult<CollectionType, ObservableType> {
    collection: AngularFirestoreCollection<CollectionType>;
    observable: Observable<ObservableType>;
}

// Look into adding overloads for generics
