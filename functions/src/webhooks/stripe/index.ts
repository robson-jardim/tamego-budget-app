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

    let event;
    let hook;
    let data;

    try {
        const signature = request.headers['stripe-signature'];
        // Note rawBody property is used instead of body due to the middleware present on Firebase Cloud Functions
        event = stripe.webhooks.constructEvent(request.rawBody, signature, webhooksSecret);
        hook = event.type;
        data = event.data.object;
        console.log(`Stripe web hook: ${hook}`);
    } catch (error) {
        console.error('Error', error.message);
        return response.status(400).send(`Webhook Error: ${error.message}`);
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
        console.error(error);
        return response.status(400).send('Unable to retrieve customer');
    }

    if ('invoice.payment_succeeded' === hook) {
        try {
            user.premium.active = true;
            await userDocRef.update(user);
            return response.status(200).send(`Set premium status to active for user: ${user.userId}`);
        } catch (error) {
            console.error(error);
            console.error('Unable to set premium to active');
            return response.status(400).send('Unable to set premium to active');
        }
    }
    else if ('invoice.payment_failed' === hook) {
        try {
            user.premium.active = false;
            await userDocRef.update(user);
            return response.status(200).send(`Set premium status to inactive for user: ${user.userId}`);
        } catch (error) {
            console.error(error);
            console.error('Unable to set premium to inactive');
            return response.status(400).send('Unable to set premium to inactive');
        }
    }
    else if ('customer.subscription.updated' === hook) {
        // Occurs whenever a subscription changes (e.g., switching from one plan to another or changing the status from trial to active).

        if (!data.trial_end) {
            return response.status(200).send('No changes made');
        }

        const now = new Date();
        const trialEnd = new Date(data.trial_end * 1000);

        if (trialEnd < now) {
            user.premium.isTrial = false;
            user.premium.trialEnd = null;

            try {
                await userDocRef.update(user);
                return response.status(200).send('Successfully ended user premium trial');
            } catch (error) {
                console.error(error);
                console.error('Unable to end premium trial');
                return response.status(400).send('Unable to end premium trial');
            }
        }
        else {
            return response.status(200).send('No changes made');
        }
    }
    else {
        response.status(400).send('Not a matching webhook');
        throw new Error(`${hook}:  not a matching webhook`);
    }
});

export const stripeWebhooks = router;
