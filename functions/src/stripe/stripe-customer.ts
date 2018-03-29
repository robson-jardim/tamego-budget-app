import * as functions from 'firebase-functions';
import { CustomerId, PaymentToken } from './index';

const stripe = require('stripe')(functions.config().stripe.secret_key);

export const createStripeCustomer = async (email = null) => {
    const customer = await stripe.customers.create({
        email
    });

    return customer.id;
};

export const updateCustomerEmail = async (customerId: string, email: string) => {
    await stripe.customers.update(customerId, {
        email: email
    });
};


export const setCustomerPaymentSource = async (customerId: CustomerId, token: PaymentToken) => {
    const customerCard = await stripe.customers.update(customerId, {
        source: token
    });

    const customerCardId = customerCard.sources.data[0].id;

    return customerCardId;
};


