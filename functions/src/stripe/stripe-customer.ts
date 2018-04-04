import * as functions from 'firebase-functions';
import { CustomerId, PaymentToken } from './index';
import { CardDetails } from '@models/user.model';

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

    // The current implementation will only ever attach one card to an account at a single time.
    // If in the future this changes, the zeroth index will have to be changed to account for this.
    const customerCardId = customerCard.sources.data[0].id;

    return customerCardId;
};

export const retrieveCustomerCardDetails = async (customerId: string, cardId: string): Promise<CardDetails> => {
    const creditCard = await stripe.customers.retrieveCard(customerId, cardId);

    return {
        cardId: cardId,
        brand: creditCard.brand,
        expirationMonth: creditCard.exp_month,
        expirationYear: creditCard.exp_year,
        lastFour: creditCard.last4
    }

};


export const deleteCustomerCard = async (customerId: string, cardId: string) => {
    const response = await stripe.customers.deleteCard(customerId, cardId);
    return response.deleted;
};

