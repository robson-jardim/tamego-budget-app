import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import { User } from '../../../models/user.model';

const db = admin.firestore();

export const onUserCreate = functions.auth.user().onCreate(async event => {
    try {
        const user: User = {
            userId: event.data.uid,
            email: event.data.email
        };

        return await db.doc(`users/${user.userId}`).set(user, {merge: true});
    } catch (error) {
        throw error;
    }
});
