const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();


// POST
exports.category = (request, response) => {

    const budgetRef = db.collection('budgets')
        .where('key',  '==', 'testKey');

    return budgetRef.get().then(snapshot => {
        const data = [];

        snapshot.forEach(x => {
            data.push(x.data());
        });

        return response.json(data);
    });
};
