import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

const router = express.Router();
const db = admin.firestore();

// POST: api/verifyUser
router.get('/', (request, response) => {
    
    response.send('Success');
});

export const verifyUserController = router;
