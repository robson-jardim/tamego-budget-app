const functions = require('firebase-functions');
const admin = require('firebase-admin');

export const createUserAccount = functions.auth.user().onCreate((event: any) => {

    const userId = event.data.uid;
    const email = event.data.email;

    const docRef = admin.firestore().collection('users').doc(userId);

    const newUserData = {
        userId: userId,
        email: email
    };

    return docRef.set(newUserData);
});

