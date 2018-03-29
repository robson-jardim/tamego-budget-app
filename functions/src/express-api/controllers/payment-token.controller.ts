import * as admin from 'firebase-admin';
import * as express from 'express';
import { Validator, ValidationError } from 'express-json-validator-middleware';
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

    const userId = request.user.uid;
    const userDoc = await db.doc('users/' + userId);

    let user: User;

    try {
        const userDoc = await db.doc('users/' + userId).get();
        user = userDoc.data() as User;
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
        await userDoc.update(user);
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
