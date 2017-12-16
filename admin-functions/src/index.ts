import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://budget-app-dev.firebaseio.com'
});

export { api } from './express-api';

