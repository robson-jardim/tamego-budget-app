import * as admin from 'firebase-admin';
// noinspection ES6ConvertRequireIntoImport
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://budget-app-dev.firebaseio.com'
});

export { api } from './express-api';

