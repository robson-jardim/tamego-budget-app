import * as functions from 'firebase-functions';
import * as express from 'express';

const router = express.Router();
const stripe = require('stripe')(functions.config().stripe.secret_key);
const webhooksSecret = functions.config().stripe.webhooks_secret;

// POST: webhooks/stripe
router.post('/', async (request: any, response) => {

    try {
        const signature = request.headers['stripe-signature'];
        // Note rawBody property is used instead of body due to the middleware present on Firebase Cloud Functions
        const event = stripe.webhooks.constructEvent(request.rawBody, signature, webhooksSecret);
        return response.json(event);
    } catch (error) {
        console.log('Error', error.message);
        return response.status(400).send('Webhook Error:' + error.message);
    }

});

export const stripeWebhooks = router;
