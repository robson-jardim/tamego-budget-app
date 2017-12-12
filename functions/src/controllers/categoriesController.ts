import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
import { DocumentReference, DocumentSnapshot } from "@google-cloud/firestore";

import * as express from 'express';

const router = express.Router();

import { Validator } from 'express-json-validator-middleware';
const validator = new Validator({allErrors: true});
const validate = validator.validate;

const categoryTransferSchema = {
    type: 'object',
    required: ['dest_group', 'categoryId', 'budgetId'],
    properties: {
        dest_group: {
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

    const data = {
        dest_group: request.body.dest_group,
        categoryId: request.body.categoryId,
        budgetId: request.body.budgetId
    };

    const budgetRef: DocumentReference = db.doc(`budgets/${data.budgetId}`);

    try {
        const budgetDoc: DocumentSnapshot = await budgetRef.get();

        if (!budgetDoc.exists) {
            response.status(400).send('No such budget document');
        }

        if (budgetDoc.data().userId != request.user.uid) {
            response.status(401).send('Insufficient permissions');
        }
    }
    catch (error) {
        sendServerError();
    }

    try {
        const categoryGroupRef: DocumentReference = db.doc(budgetRef.path + '/categoryGroups/' + data.dest_group);
        const categoryGroupDoc: DocumentSnapshot = await categoryGroupRef.get();

        if(!categoryGroupDoc.exists) {
            response.status(400).send('No such category group document');
        }
    }
    catch(error) {
        response.status(500).send('2');
        sendServerError();
    }

    try {
        const categoryRef: DocumentReference = db.doc(budgetRef.path + '/categories/' + data.categoryId);
        const categoryDoc: DocumentSnapshot = await categoryRef.get();

        if(!categoryDoc.exists) {
            response.status(400).send('No such category document');
        }

        await categoryRef.update({
            groupId: data.dest_group
        });

        sendSuccessResponse();
    }
    catch(error) {
        response.status(500).send('3');
        sendServerError();
    }


    function sendServerError() {
        response.status(500).send('Unable to connect to database');
    }

    function sendSuccessResponse() {
        response.status(200);
    }
});


export const categoriesController = router;
