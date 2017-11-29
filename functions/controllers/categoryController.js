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

    add1(10).then(v => {
        console.log(v);  // prints 60 after 4 seconds.
    });

    const budgetRef = db.doc(`budgets/${request.body.budgetId}`);

    return budgetRef.get().then(doc => {
        if (!doc.exists) {
            return response.status(400).send('No such budget document');
        }

        if (doc.data().userId != request.user.uid) {
            return response.status(400).send('Insufficient permissions');
        }

        const origin = db.doc(`budgets/${request.body.budgetId}/categoryGroups/${request.body.origin}`);
        const destination = db.doc(`budgets/${request.body.budgetId}/categoryGroups/${request.body.destination}`);

        return Promise.all([
            origin.get(),
            destination.get()
        ]).then(result => {

            if (result[0].exists && result[1].exists) {

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

async function add1(x) {
    const a = await resolveAfter2Seconds(20);
    const b = await resolveAfter2Seconds(30);
    return x + a + b;
}

function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 2000);
    });
}


categoryGroupController.delete('/:groupId', (request, response) => {
    response.json('success');
});

module.exports = categoryGroupController;
