import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createStripeCustomer, createStripeSubscription } from '../stripe';
import { Subscription } from '../stripe/stripe-subscription';
import { User } from '@models/user.model';
import { Customer } from '@models/customer.model';

const db = admin.firestore();

export const onUserCreate = functions.auth.user().onCreate(async event => {

    const serverTimestamp: Date = <any>admin.firestore.FieldValue.serverTimestamp();

    const userData: User = {
        userId: event.data.uid,
        email: event.data.email || null,
        timeCreated: serverTimestamp,
        emailVerified: false,
        customerId: null,
        subscriptionId: null,
        cardDetails: null,
        isPremium: false,
        trial: {
            isTrial: false,
            trialEnd: null
        }
    };

    try {
        userData.customerId = await createStripeCustomer(userData.email);
    }
    catch (error) {
        console.error('[Stripe] Unable to add customer');
        console.error(error);
        throw error;
    }

    try {
        const subscription: Subscription = await createStripeSubscription(userData.customerId);
        userData.subscriptionId = subscription.subscriptionId;
        userData.trial = subscription.trial;
        userData.isPremium = true;
    } catch (error) {
        console.error('[Stripe] Unable to add subscription');
        console.error(error);
        throw error;
    }

    try {
        const batch = admin.firestore().batch();

        const userDocRef = db.doc(`users/${userData.userId}`);
        batch.set(userDocRef, userData);

        const customerUserRef = db.doc('customers/' + userData.customerId);
        const customer: Customer = {
            userId: userData.userId,
            customerId: userData.customerId
        };
        batch.set(customerUserRef, customer);

        await batch.commit();
        console.log('User added: ' + userData.userId);
    } catch (error) {
        console.error('Failed to add user document');
        console.error(error);
        throw error;
    }

});
