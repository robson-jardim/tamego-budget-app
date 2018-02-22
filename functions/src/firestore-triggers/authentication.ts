import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createStripeCustomer, createStripeSubscription } from '../stripe';
import { Subscription } from '../stripe/create-subscription';
import { User } from '@models/user.model';

const db = admin.firestore();

export const onUserCreate = functions.auth.user().onCreate(async event => {

    const user: User = {
        userId: event.data.uid,
        email: event.data.email || null,
        timeCreated: new Date(),
        emailVerified: false,
        customerId: null,
        subscriptionId: null,
        isPremium: false,
        trial: {
            isTrial: false,
            trialEnd: null
        }
    };

    try {
        user.customerId = await createStripeCustomer(user.email);
    }
    catch (error) {
        console.error('Unable to add stripe customer');
        console.error(error);
        throw error;
    }

    try {
        const subscription: Subscription = await createStripeSubscription(user.customerId);
        user.subscriptionId = subscription.subscriptionId;
        user.trial = subscription.trial;
        user.isPremium = true;
    } catch (error) {
        console.error('Unable to add stripe subscription');
        console.error(error);
        throw error;
    }

    try {
        await db.doc(`users/${user.userId}`).set(user);
        console.log('User added: ' + user.userId);
    } catch (error) {
        console.error('Failed to add user document');
        console.error(error);
        throw error;
    }

});
