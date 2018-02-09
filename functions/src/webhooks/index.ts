import * as functions from 'firebase-functions';
import * as express from 'express';
import { stripeWebhooks } from './stripe';

const app = express();
app.use('/stripe', stripeWebhooks);

export const webhooks = functions.https.onRequest(app);
