import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

import * as firestoreTriggers from './firestore-triggers/index';
import { expressApi } from './express-api/index';

export const api = functions.https.onRequest(expressApi);

export const onUserCreate = firestoreTriggers.onUserCreate;
export const onValueCreate = firestoreTriggers.onValueCreate;
export const onValueUpdate = firestoreTriggers.onValueUpdate;
