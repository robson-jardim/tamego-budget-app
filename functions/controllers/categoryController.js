const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const express = require("express");
const categoryGroupController = express.Router();

const {Validator} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;

const groupTransferSchema = {
    type: 'object',
    required: ['origin', 'destination', 'budgetId'],
    properties: {
        origin: {
            type: 'string'
        },
        destination: {
            type: 'string'
        },
        budgetId: {
            type: 'string'
        }
    }
};

categoryGroupController.post('/transfer', validate({body: groupTransferSchema}), (request, response) => {

    const budgetRef = db.doc(`budgets/${request.body.budgetId}`);

    return budgetRef.get().then(doc => {
        if (!doc.exists) {
            return response.status(200).send('No such document');
        }

        if (doc.data().userId != request.user.uid) {
            return response.status(200).send('Insufficient permissions');
        }

        const origin = db.doc(`budgets/${request.body.budgetId}/categoryGroups/${request.body.origin}`);
        const destination = db.doc(`budgets/${request.body.budgetId}/categoryGroups/${request.body.destination}`);

        return Promise.all([
            origin.get(),
            destination.get()
        ]).then(result => {

            if(result[0].exists && result[1].exists) {

                const originCategories = db.collection(`budgets/${request.body.budgetId}/categories`)
                    .where('groupId', '==', request.body.origin);

                const batch = db.batch();

                return originCategories.get().then(snapshot => {
                    snapshot.forEach(doc => {
                        batch.update(doc.ref, {groupId: request.body.destination});
                    });
                    return 1;
                }).then(res => {
                    return batch.commit().then(() => {
                        return response.send('Success');
                    });
                }).then(res => {
                })
            }
        });
    })
});

categoryGroupController.delete('/:groupId', (request, response) => {
    response.json('success');
});

module.exports = categoryGroupController;
