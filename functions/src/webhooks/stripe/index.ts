import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import { Customer } from '@models/customer.model';
import { User } from '@models/user.model';

const router = express.Router();
const stripe = require('stripe')(functions.config().stripe.secret_key);
const webhooksSecret = functions.config().stripe.webhooks_secret;

const db = admin.firestore();

// POST: webhooks/stripe
router.post('/', async (request: any, response) => {

    let webhookName;
    let data;

    try {
        const signature = request.headers['stripe-signature'];
        // Note rawBody property is used instead of body due to the middleware present on Firebase Cloud Functions
        const event = stripe.webhooks.constructEvent(request.rawBody, signature, webhooksSecret);
        webhookName = event.type;
        data = event.data.object;
        console.log(`Stripe web hook: ${webhookName}`);
    } catch (error) {
        console.error(error);
        return response.status(400).send(`Webhook Error: ${error}`);
    }

    let userDocRef;
    let user: User;

    try {
        const customerDoc = await db.doc('customers/' + data.customer).get();
        const customer: Customer = customerDoc.data() as any;

        userDocRef = db.doc('users/' + customer.userId);
        const userDoc = await userDocRef.get();
        user = userDoc.data();
    } catch (error) {
        const message = `Unable to retrieve customer document: ${data.customer}`;
        console.error(error);
        console.error(message);
        return response.status(400).send(message);
    }

    if ('invoice.payment_succeeded' === webhookName) {
        try {
            user.premium.active = true;
            await userDocRef.update(user);
            const message = `Set premium status to active for user: ${user.userId}`;
            console.log(`Set premium status to active for user: ${user.userId}`);
            return response.status(200).send(message);
        } catch (error) {
            console.error(error);
            const message = `Unable to set premium status to ACTIVE for user: ${user.userId}`;
            console.error(message);
            return response.status(400).send(message);
        }
    }
    else if ('invoice.payment_failed' === webhookName) {
        try {
            user.premium.active = false;
            await userDocRef.update(user);
            const message = `Set premium status to INACTIVE for user: ${user.userId}`;
            console.log(message);
            return response.status(200).send(message);
        } catch (error) {
            console.error(error);
            const message = `Unable to set premium status to INACTIVE for user: ${user.userId}`;
            console.error(message);
            return response.status(400).send(message);
        }
    }
    else if ('customer.subscription.updated' === webhookName) {
        // Occurs whenever a subscription changes (e.g., switching from one plan to another or changing the status from trial to active).
        const subscriptionId = data.id;

        if (!data.trial_end) {
            const message = `No trial present on subscription: ${subscriptionId}`;
            console.log(message);
            return response.status(200).send(message);
        }

        const now = new Date();
        const trialEnd = new Date(data.trial_end * 1000);

        if (trialEnd < now) {
            user.premium.isTrial = false;
            user.premium.trialEnd = null;

            try {
                await userDocRef.update(user);
                const message = `Ended premium trial for user: ${user.userId}`;
                console.log(message);
                return response.status(200).send(message);
            } catch (error) {
                const message = `Unable premium trial for user: ${user.userId}`;
                console.error(error);
                console.error(message);
                return response.status(400).send(message);
            }
        }
        else {

            if (user.premium.trialEnd.getTime() !== trialEnd.getTime()) {
                user.premium.isTrial = true;
                user.premium.trialEnd = trialEnd;

                try {
                    await userDocRef.update(user);
                    const message = `Updated trial end date for user: ${user.userId}`;
                    console.log(message);
                    return response.status(200).send(message);
                } catch (error) {
                    const message = `Unable to update trial end date for user: : ${user.userId}`;
                    console.error(error);
                    console.error(message);
                    return response.status(400).send(message);
                }
            }
            else {
                const message = `No changes made to user: ${user.userId}`;
                console.log(message);
                return response.status(200).send(message);
            }
        }
    }
    else {
        response.status(400).send('Not a matching webhook');
        throw new Error(`${webhookName}:  not a matching webhook`);
    }
});

export const stripeWebhooks = router;
