import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const stripe = require('stripe')(functions.config().stripe.secret_key);
const db = admin.firestore();

export const createStripeSubscription = async (customerId: string) => {
    const premiumPlanSnapshot = await db.doc('stripePlans/premium').get();
    const premiumPlanId = premiumPlanSnapshot.get('planId');

    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        trial_period_days: 30,
        items: [
            {
                plan: premiumPlanId
            }
        ]
    });

    return {
        subscriptionId: subscription.id,
        premium: true,
        trial: {
            isTrial: true,
            trialEnd: new Date(subscription.trial_end * 1000)
        }
    };

};


