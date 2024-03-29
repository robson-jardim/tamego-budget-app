import * as admin from 'firebase-admin';
admin.initializeApp();

export { api } from './express-api';
export { webhooks } from './webhooks';
export { onTemporaryUserCreate } from './firestore-triggers';
export { onValueCreate } from './firestore-triggers';
export { onValueUpdate } from './firestore-triggers';
