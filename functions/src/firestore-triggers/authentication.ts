import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-functions/lib/providers/auth';

const db = admin.firestore();

// Stripe
import { createStripeCustomer, createStripeSubscription } from '../stripe';
import { Subscription } from '../stripe/stripe-subscription';

// Models
import { User } from '@models/user.model';
import { Customer } from '@models/customer.model';
import { EventContext } from 'firebase-functions/lib/cloud-functions';

export const onUserCreate = functions.auth.user()
    .onCreate(async (userRecord: UserRecord, context: EventContext) => {

        const serverTimestamp: Date = admin.firestore.FieldValue.serverTimestamp() as any;

        const user: User = {
            userId: userRecord.uid,
            email: userRecord.email || null,
            emailVerified: false,
            timeCreated: serverTimestamp,
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
