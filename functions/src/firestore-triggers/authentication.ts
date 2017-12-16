import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import { User } from '../../../models/user.model';

const db = admin.firestore();

export const onUserCreate = functions.auth.user().onCreate(event => {

    const user: User = {
        userId: event.data.uid,
        email: event.data.email
    };

    return db.doc(`users/${user.userId}`).set(user, {merge: true});
});
