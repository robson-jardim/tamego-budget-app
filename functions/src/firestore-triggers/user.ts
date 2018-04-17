import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

// Stripe
import { createStripeCustomer, createStripeSubscription } from '../stripe';
import { Subscription } from '../stripe/stripe-subscription';

// Models
import { User } from '@models/user.model';
import { Customer } from '@models/customer.model';

import { EventContext } from 'firebase-functions/lib/cloud-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export const onUserCreate = functions.firestore.document('users/{userId}')
    .onCreate(async (snapshot: DocumentSnapshot, context: EventContext) => {

        const nowTimestamp = new Date();

        const user: User = {
            userId: snapshot.data().userId,
            email: snapshot.data().email || null,
            emailVerified: false,
            timeCreated: nowTimestamp,
            customerId: null,
            subscriptionId: null,
            cardDetails: null,
            premium: {
                active: false,
                isTrial: false,
                trialEnd: null
            }
        };

        try {
            user.customerId = await createStripeCustomer(user.email);
        }
        catch (error) {
            console.error('[Stripe] Unable to add customer');
            console.error(error);
            throw error;
        }

        try {
            const subscription: Subscription = await createStripeSubscription(user.customerId);
            user.subscriptionId = subscription.subscriptionId;
            user.premium = subscription.premium;
        } catch (error) {
            console.error('[Stripe] Unable to add subscription');
            console.error(error);
            throw error;
        }

        try {

            const batch = admin.firestore().batch();
            const userDocRef = db.doc(`users/${user.userId}`);
            batch.set(userDocRef, user);

            const customerUserRef = db.doc('customers/' + user.customerId);
            const customer: Customer = {
                userId: user.userId,
                customerId: user.customerId
            };
            batch.set(customerUserRef, customer);

            await batch.commit();
            console.log('User added: ' + user.userId);
        } catch (error) {
            console.error('Failed to add user document');
            console.error(error);
            throw error;
        }

    });
