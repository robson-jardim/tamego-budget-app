import * as admin from 'firebase-admin';
import * as express from 'express';

const router = express.Router();
const db = admin.firestore();
const auth = admin.auth();

// POST: api/verifyUser
router.post('/', async (request: any, response) => {

    const userId = request.user.uid;
    const emailVerified = request.user.email_verified;

    if (!emailVerified) {
        return response.status(400).json({
            message: 'User has not completed verification email'
        });
    }

    try {
        await db.doc('users/' + userId).update({emailVerified: true});
        return response.status(200).json({
            message: 'User email verification process completed'
        });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            message: 'Database error'
        });
    }
});

export const verifyUserController = router;
