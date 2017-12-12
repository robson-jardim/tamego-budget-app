import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
import { DocumentReference, DocumentSnapshot } from "@google-cloud/firestore";

import * as express from 'express';

const router = express.Router();

import { Validator } from 'express-json-validator-middleware';
import * as firebase from 'firebase';

const validator = new Validator({allErrors: true});
const validate = validator.validate;

const deleteGroupSchema = {
    type: 'object',
    required: ['origin_group', 'dest_group', 'budgetId'],
    properties: {
        origin_group: {
            type: 'string'
        },
        dest_group: {
            type: 'string'
        },
        budgetId: {
            type: 'string'
        }
    }
};

// DELETE: api/categoryGroups
router.delete('/', validate({body: deleteGroupSchema}), async (request: any, response) => {

    if (request.body.dest_group === request.body.origin_group) {
        return response.status(400).send('Origin and destination groups must be different');
    }

    try {
        await db.runTransaction(async t => {

            const budgetRef: DocumentReference = db.doc(`budgets/${request.body.budgetId}`);

            try {
                const budgetDoc: DocumentSnapshot = await t.get(budgetRef);

                if (!budgetDoc.exists) {
                    response.status(400).send('No such budget document');
                }

                if (budgetDoc.data().userId != request.user.uid) {
                    response.status(400).send('Insufficient permissions');
                }
            }
            catch (error) {
                throw error;
            }

            const originGroupRef = db.doc(`${budgetRef.path}/categoryGroups/${request.body.origin_group}`);
            const destGroupRef = db.doc(`${budgetRef.path}/categoryGroups/${request.body.dest_group}`);

            try {
                const originGroupDoc: DocumentSnapshot = await t.get(originGroupRef);
                const destGroupDoc: DocumentSnapshot = await t.get(destGroupRef);

                if (!originGroupDoc.exists) {
                    return response.status(400).json('No such origin group document');
                }

                if (!destGroupDoc.exists) {
                    return response.status(400).json('No such destination group document');
                }
            }
            catch (error) {
                throw error;
            }

            try {
                const originCategoriesRef = db.collection(`${budgetRef.path}/categories`)
                    .where('groupId', '==', request.body.origin_group);

                const originCategoriesCollection = await t.get(originCategoriesRef);

                originCategoriesCollection.forEach((category: DocumentSnapshot) => {
                    t.update(category.ref, {groupId: request.body.dest_group})
                });

                t.delete(originGroupRef);
                return response.status(200);
            }
            catch (error) {
                throw error;
            }
        });
    }
    catch (error) {
        return response.status(500).send('Unable to complete transaction');
    }

});


export const categoryGroupController = router;
