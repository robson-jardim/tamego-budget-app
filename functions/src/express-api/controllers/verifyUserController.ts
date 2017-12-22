import * as admin from 'firebase-admin';
import * as express from 'express';

const router = express.Router();
const db = admin.firestore();
const auth = admin.auth();

// POST: api/verifyUser
router.post('/', async (request: any, response) => {

    const userId = request.user.uid;
    let user;

    try {
        user = await auth.getUser(userId);
    }
    catch (error) {
        console.error(error);
        return response.status(500).send('Database error');
    }

    try {
        if (user.emailVerified) {
            await db.doc(`users/${userId}`).update({emailVerified: true});
            return response.status(200).send('User document email verified');
        }
        return response.status(400).send('User email is not verified');
    }
    catch (error) {
        console.error(error);
        return response.status(500).send('Database error');
    }
});

export const verifyUserController = router;
