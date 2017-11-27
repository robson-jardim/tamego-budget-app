const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({origin: true}));
app.listen(4949);

const authenticate = (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
        req.user = decodedIdToken;
        next();
    }).catch(error => {
        res.status(403).send('Unauthorized');
    });
};
app.use(authenticate);

app.get('/test', (request, response) => {
    response.json('hello from test');
});

exports.api = functions.https.onRequest(app);

