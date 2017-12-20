import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { User } from '../../../models/user.model';
const db = admin.firestore();

export const onUserCreate = functions.auth.user().onCreate(async event => {

    const user: User = {
        userId: event.data.uid,
        email: event.data.email
    };

    try {
        await db.doc(`users/${user.userId}`).set(user);
        console.log('User document added: ' + JSON.stringify(user));
    } catch (error) {
        console.error('Failed to add user document');
        console.error(error);
        throw error;
    }
});
