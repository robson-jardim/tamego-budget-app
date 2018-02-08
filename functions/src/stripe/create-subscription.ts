import * as functions from 'firebase-functions';
const stripe = require('stripe')(functions.config().stripe.secret_key);

export const createStripeSubscription = async () => {

};


