import * as admin from 'firebase-admin';
import * as express from 'express';
import { Validator } from 'express-json-validator-middleware';
import { User } from '@models/user.model';
import { setCustomerPaymentSource } from '../../stripe/stripe-customer';
import { PaymentToken } from '../../stripe';

const router = express.Router();
const db = admin.firestore();

const validator = new Validator({ allErrors: true });
const validate = validator.validate;

const paymentTokenSchema = {
    type: 'object',
    required: ['paymentToken'],
    properties: {
        paymentToken: {
            type: 'string'
        }
    }
};

// POST: api/paymentToken
router.post('/', validate({ body: paymentTokenSchema }), async (request: any, response) => {

    const isAnonymous = request.user.firebase.sign_in_provider === 'anonymous';

    if(isAnonymous) {
        return response.status(400).json({
            message: 'Unable to add payment method to anonymous account'
        });
    }

    const userId = request.user.uid;
    const userDocRef = db.doc('users/' + userId);

    let user: User;

    try {
        const userDoc = await userDocRef.get();
        const userData: any = userDoc.data();
        user = userData as User;
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: 'Database error'
        });
    }

    try {
        const paymentToken: PaymentToken = request.body.paymentToken;
        user.creditCardId = await setCustomerPaymentSource(user.customerId, paymentToken);
    } catch (error) {
        console.error('[Stripe] Unable to add token as source');
        return response.status(500).json({
            message: 'Database error'
        });
    }

    try {
        await userDocRef.update(user);
        return response.status(200).json({
            message: `Successfully added card: ${user.creditCardId}`
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: 'Database error'
        });
    }
});

export const paymentTokenController = router;
