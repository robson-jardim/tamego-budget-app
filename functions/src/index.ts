import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://budget-app-dev.firebaseio.com'
});

import * as firestoreTriggers from './firestore-triggers/index';
import { expressApi } from './express-api/index';

export const onUserCreate = firestoreTriggers.onUserCreate;

export const api = functions.https.onRequest(expressApi);
