import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { User } from '@models/user.model';
import { signUpForTrial } from '../stripe';

const db = admin.firestore();

export const onUserCreate = functions.auth.user().onCreate(async event => {

    let user: User = {
        userId: event.data.uid,
        email: event.data.email || null,
        timeCreated: new Date(),
        emailVerified: false,
        customerId: null,
        subscriptionId: null,
        premium: false,
        trial: {
            isTrial: false,
            trialEnd: null
        }
    };

    const isAnonymousAccount = () => {
        return user.email == null;
    };

    if (!isAnonymousAccount()) {
        try {
            const trialData = await signUpForTrial(user.email);
            user = {...user, ...trialData};
        } catch (error) {
            console.error('Unable to signup for trial');
            console.error(error);
            throw error;
        }
    }

    try {
        await db.doc(`users/${user.userId}`).set(user);
        console.log('User document added: ' + JSON.stringify(user));
    } catch (error) {
        console.error('Failed to add user document');
        console.error(error);
        throw error;
    }


});
