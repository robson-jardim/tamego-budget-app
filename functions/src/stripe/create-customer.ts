import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const stripe = require('stripe')(functions.config().stripe.secret_key);
const db = admin.firestore();

export const createStripeCustomer = async (email?: string) => {

    let customer;

    if (email) {
        customer = await stripe.customers.create({
            email
        });
    }
    else {
        customer = await stripe.customers.create({});
    }

    return customer.id;
};

export const updateCustomerEmail = async (customerId: string, email: string) => {
    await stripe.customers.update(customerId, {
        email: email
    });
};


