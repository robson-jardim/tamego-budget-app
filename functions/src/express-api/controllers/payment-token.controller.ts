import * as admin from 'firebase-admin';
import * as express from 'express';
import { Validator } from 'express-json-validator-middleware';
import { User } from '@models/user.model';
import { retrieveCustomerCardDetails, setCustomerPaymentSource } from '../../stripe/stripe-customer';
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

    if (isAnonymous) {
        return response.status(400).json({
            message: 'Unable to add billing method to anonymous account'
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

    if (!user.email) {
        return response.status(400).json({
            message: "Unable to add billing method to account with an unassigned email"
        });
    }

    try {
        const paymentToken: PaymentToken = request.body.paymentToken;

        const cardId = await setCustomerPaymentSource(user.customerId, paymentToken);

        if (!cardId) {
            throw new Error('Card ID not returned from stripe');
        }

        user.cardDetails = await retrieveCustomerCardDetails(user.customerId, cardId);

    } catch (error) {
        console.error(error);
        console.error('[Stripe] Unable to add token as source');
        return response.status(500).json({
            message: 'Database error'
        });
    }

    try {
        await userDocRef.update(user);
        return response.status(200).json({
            message: `Successfully added card: ${user.cardDetails.cardId}`
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: 'Database error'
        });
    }
});

export const paymentTokenController = router;
