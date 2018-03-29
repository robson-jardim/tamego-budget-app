import * as admin from 'firebase-admin';
import * as express from 'express';
import { updateCustomerEmail } from '../../stripe/stripe-customer';

const router = express.Router();
const db = admin.firestore();

// TODO - wrap controllers in express async middleware
// https://github.com/Abazhenov/express-async-handler/blob/master/index.js

// POST: api/linkAnonymousAccount
router.post('/', async (request: any, response) => {

    const isAnonymous = request.user.firebase.sign_in_provider === 'anonymous';
    const {uid} = request.user;
    const {email} = request.user;

    if (isAnonymous) {
        return response.status(400).json({
            message: 'Unable to link because no email has been associated with the given account'
        });
    }

    try {
        const userDocumentRef = db.doc('users/' + uid);
        await userDocumentRef.update({email});

        const userDocumentSnapshot = await userDocumentRef.get();
        const customerId = userDocumentSnapshot.get('customerId');

        await updateCustomerEmail(customerId, email);

        return response.status(200).json({
            message: 'Anonymous account successfully linked to email'
        });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: 'Database error'
        });
    }
});

export const linkAnonymousAccountController = router;
