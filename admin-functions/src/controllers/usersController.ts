import * as admin from 'firebase-admin';
import * as express from 'express';
const router = express.Router();
const db = admin.firestore();

// DELETE: /users
router.delete('/', async (request, response) => {
    response.send('Success');
});

export const usersController = router;
