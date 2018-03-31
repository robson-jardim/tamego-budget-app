import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const stripe = require('stripe')(functions.config().stripe.secret_key);
const db = admin.firestore();

export interface Subscription {
    subscriptionId: string;
    premium: {
        active: true;
        isTrial: boolean;
        trialEnd: Date;
    };
}

export const createStripeSubscription = async (customerId: string): Promise<Subscription> => {
    const premiumPlanSnapshot = await db.doc('pricingPlans/premium').get();
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
        premium: {
            active: true,
            isTrial: true,
            trialEnd: new Date(subscription.trial_end * 1000)
        }
    };
};


