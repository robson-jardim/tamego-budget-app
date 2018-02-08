import * as functions from 'firebase-functions';
const stripe = require('stripe')(functions.config().stripe.secret_key);

export const createStripeCustomer = async (email: string) => {
    const customer = await stripe.customers.create({email});
    return customer.id;
};


