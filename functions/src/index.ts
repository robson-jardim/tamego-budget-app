import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
import * as firestoreTriggers from './firestore-triggers/index';

export const onUserCreate = firestoreTriggers.onUserCreate;
export const onUserCreateAsync = firestoreTriggers.onUserCreateAsync;
