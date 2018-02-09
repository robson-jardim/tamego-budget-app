import * as admin from 'firebase-admin';
import * as express from 'express';
import { signUpForTrial } from '../../stripe';

const router = express.Router();
const db = admin.firestore();
const auth = admin.auth();

// POST: api/linkAnonymousAccount
router.post('/', async (request: any, response) => {

    const {isAnonymous} = request.user;
    const {uid} = request.user;
    const {email} = request.user;

    if (isAnonymous) {
        return response.status(400).json({
            message: 'Account must be linked to an email before setting email to user document.'
        });
    }

    try {
    } catch (error) {
        console.error('Unable to signup for trial');
        console.error(error);
        throw error;
    }

    try {
        const data = await signUpForTrial(email);
        await db.doc('users/' + uid).update({email, ...data});

        console.log(`Linked email for userId: ${uid}`);
        console.log('User signed up for trial');

        return response.status(200).json({
            message: 'Anonymous account link complete. Trial started'
        });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: 'Stripe or database error'
        });
    }
});

export const linkAnonymousAccountController = router;
