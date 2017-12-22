import * as admin from 'firebase-admin';
import { expressApi } from './express-api';
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://budget-app-dev.firebaseio.com'
});


export const api = expressApi;
