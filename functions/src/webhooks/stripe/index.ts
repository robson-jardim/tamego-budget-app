import * as functions from 'firebase-functions';
import * as express from 'express';

const router = express.Router();
const stripe = require('stripe')(functions.config().stripe.secret_key);
const webhooksSecret = functions.config().stripe.webhooks_secret;

// POST: webhooks/stripe
router.post('/', async (request: any, response) => {

    let event;
    let hook;

    try {
        const signature = request.headers['stripe-signature'];
        // Note rawBody property is used instead of body due to the middleware present on Firebase Cloud Functions
        event = stripe.webhooks.constructEvent(request.rawBody, signature, webhooksSecret);
        hook = event.type;
    } catch (error) {
        console.error('Error', error.message);
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log(`Stripe web hook: ${hook}`);

    if ('invoice.payment_succeeded' === hook) {
        // Occurs whenever an invoice payment attempt succeeds.
        // TODO - finish webhook
        return response.json(event);
    }
    else if ('invoice.payment_failed' === hook) {
        // Occurs whenever an invoice payment attempt fails, either due to a declined payment or the lack of a stored payment method.
        // TODO - finish webhook
        return response.json(event);
    }
    else if ('customer.subscription.updated' === hook) {
        // Occurs whenever a subscription changes (e.g., switching from one plan to another or changing the status from trial to active).
        return response.json(event);
    }

    response.status(500).send('Not a matching webhook');
    throw new Error(`${hook}:  not a matching webhook`);
});

export const stripeWebhooks = router;
