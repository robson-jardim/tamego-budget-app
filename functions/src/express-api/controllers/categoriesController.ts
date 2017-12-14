import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
import { DocumentReference, DocumentSnapshot } from "@google-cloud/firestore";

import * as express from 'express';

const router = express.Router();

import { Validator } from 'express-json-validator-middleware';
import * as firebase from 'firebase';
import Transaction = firebase.firestore.Transaction;

const validator = new Validator({allErrors: true});
const validate = validator.validate;

const categoryTransferSchema = {
    type: 'object',
    required: ['destinationGroup', 'categoryId', 'budgetId'],
    properties: {
        destinationGroup: {
            type: 'string'
        },
        categoryId: {
            type: 'string'
        },
        budgetId: {
            type: 'string'
        }
    }
};

// POST: api/categories
router.post('/', validate({body: categoryTransferSchema}), async (request: any, response) => {

    try {
        await db.runTransaction(async t => {

            const budgetRef: DocumentReference = db.doc(`budgets/${request.body.budgetId}`);

            try {
                const budgetDoc: DocumentSnapshot = await t.get(budgetRef);

                if (!budgetDoc.exists) {
                    return response.status(400).send('No such budget document');
                }

                if (budgetDoc.data().userId != request.user.uid) {
                    return response.status(401).send('Insufficient permissions');
                }
            }
            catch (error) {
                throw error;
            }

            try {
                const categoryGroupRef: DocumentReference = db.doc(budgetRef.path + '/categoryGroups/' + request.body.destinationGroup);
                const categoryGroupDoc: DocumentSnapshot = await t.get(categoryGroupRef);

                if (!categoryGroupDoc.exists) {
                    return response.status(400).send('No such category group document');
                }
            }
            catch (error) {
                throw error;
            }

            try {
                const categoryRef: DocumentReference = db.doc(budgetRef.path + '/categories/' + request.body.categoryId);
                const categoryDoc: DocumentSnapshot = await t.get(categoryRef);

                if (!categoryDoc.exists) {
                    return response.status(400).send('No such category document');
                }

                t.update(categoryRef, {
                    groupId: request.body.categoryId
                });

                return response.status(200);
            }
            catch (error) {
                throw error;
            }
        });
    }
    catch (error) {
        return response.status(500).send('Unable to connect to database');
    }
});


export const categoriesController = router;
