import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

import { expressApi } from './express-api/index';
import * as firestoreTriggers from './firestore-triggers/index';

// export const api = functions.https.onRequest(expressApi);
export const onUserCreate = firestoreTriggers.onUserCreate;
