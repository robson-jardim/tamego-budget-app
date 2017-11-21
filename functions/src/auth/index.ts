import { User } from '../../../models/user.model';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

export const createUserAccount = functions.auth.user().onCreate((event: any) => {

    const newUser: User = {
        userId: event.data.uid,
        email: event.data.email
    };

    const docRef = admin.firestore().collection('users').doc(newUser.userId);

    return docRef.set(newUser).then((user: User) => {
        console.log('User record added: ' + JSON.stringify(newUser));
    });
});

