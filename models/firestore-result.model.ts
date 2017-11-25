import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection } from 'angularfire2/firestore';

export class FirestoreResult<T> {
    collection: AngularFirestoreCollection<T>;
    observable: Observable<T[]>;
}
