import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
import { DocumentReference, DocumentSnapshot } from "@google-cloud/firestore";

import * as express from 'express';

const router = express.Router();

import * as bluebird from 'bluebird';

import { Validator } from 'express-json-validator-middleware';

const validator = new Validator({allErrors: true});
const validate = validator.validate;

const groupTransferSchema = {
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
router.delete('/', validate({body: groupTransferSchema}), async (request: any, response) => {

    const data = {
        origin: request.body.origin_group,
        dest: request.body.dest_group,
        budgetId: request.body.budgetId
    };

    const budgetRef: DocumentReference = db.doc(`budgets/${data.budgetId}`);

    try {
        const budgetDoc: DocumentSnapshot = await budgetRef.get();

        if (!budgetDoc.exists) {
            response.status(400).json('No such budget document');
        }

        if (budgetDoc.data().userId != request.user.uid) {
            return response.status(400).json('Insufficient permissions');
        }
    }
    catch (error) {
        sendServerError();
    }

    const originGroupRef = db.doc(`${budgetRef.path}/categoryGroups/${data.origin}`);
    const destGroupRef = db.doc(`${budgetRef.path}/categoryGroups/${data.dest}`);

    const results = await bluebird.props({
        originDoc: originGroupRef.get(),
        destDoc: destGroupRef.get()
    });

    if (!results.originDoc.exists) {
        response.status(400).json('No such origin document');
    }

    if (!results.destDoc.exists) {
        response.status(400).json('No such dest document');
    }

    const originCategoriesRef = db.collection(`budgets/${data.budgetId}/categories`)
        .where('groupId', '==', data.origin);

    const batch = db.batch();

    try {
        const originCategoriesCollection = await originCategoriesRef.get();

        originCategoriesCollection.forEach(doc => {
            batch.update(doc.ref, {groupId: data.dest});
        });

        batch.delete(originGroupRef);
    }
    catch (error) {
        sendServerError();
    }

    try {
        await batch.commit();
        sendSuccessResponse();
    }
    catch (error) {
        sendBatchError();
    }

    function sendServerError() {
        response.status(500).send('Unable to connect to database');
    }

    function sendBatchError() {
        response.status(500).send('Batch commit unsuccessful');
    }

    function sendSuccessResponse() {
        response.send(200);
    }
});


export const categoryGroupController = router;
