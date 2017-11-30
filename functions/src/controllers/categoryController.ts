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
    required: ['origin', 'dest', 'budgetId'],
    properties: {
        origin: {
            type: 'string'
        },
        dest: {
            type: 'string'
        },
        budgetId: {
            type: 'string'
        }
    }
};

router.post('/transfer', validate({body: groupTransferSchema}), async (request: any, response) => {

    const data = {
        origin: request.body.origin,
        dest: request.body.dest,
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

    const originRef = db.doc(`${budgetRef.path}/categoryGroups/${data.origin}`);
    const destRef = db.doc(`${budgetRef.path}/categoryGroups/${data.dest}`);

    const groupDocs = {
        originDoc: originRef.get(),
        destDoc: destRef.get()
    };

    const results = await bluebird.props(groupDocs);

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
