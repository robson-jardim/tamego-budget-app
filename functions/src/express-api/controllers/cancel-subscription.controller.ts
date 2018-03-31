import * as admin from 'firebase-admin';
import * as express from 'express';
import {  User } from '@models/user.model';
import { deleteCustomerCard } from '../../stripe/stripe-customer';

const router = express.Router();
const db = admin.firestore();

// POST: api/cancelSubscription
router.post('/', async (request: any, response) => {

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

    if (!user.cardDetails) {
        return response.status(400).json({
            message: `User is currently not subscribed`
        });
    }

    try {
        const isSuccess = await deleteCustomerCard(user.customerId, user.cardDetails.cardId);

        if (!isSuccess) {
            throw new Error('Unsuccessful customer card deletion attempt');
        }
    } catch (error) {
        console.error(error);
        console.error('[Stripe] Unable to delete customer card');
        return response.status(500).json({
            message: 'Database error'
        });
    }

    try {
        user.cardDetails = null;
        await userDocRef.update(user);
        return response.status(200).json({
            message: 'Successfully cancelled subscription'
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: 'Database error'
        });
    }


});

export const cancelSubscriptionController = router;
