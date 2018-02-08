import * as admin from 'firebase-admin';
import * as express from 'express';

const router = express.Router();
const db = admin.firestore();
const auth = admin.auth();

// POST: api/setEmailOnUser
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
        await db.doc('users/' + uid).update({email});
        console.log(`Set email for userId: ${uid}`);

        return response.status(200).json({
            message: 'Anonymous account link complete'
        });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: 'Database error'
        });
    }
});

export const setEmailOnUserController = router;
