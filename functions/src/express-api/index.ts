import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as middleware from './middleware';
import * as express from 'express';
import * as functions from 'firebase-functions';

const app = express();

const whitelist = [
    'http://localhost:4200',
    'https://budget-app-dev.firebaseapp.com',
    'https://budget-app-staging-1.firebaseapp.com',
    'https://budget-app-prod.firebaseapp.com',
    'https://app.tamego.ericlarson.io',
    'https://app.tamego.com'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(middleware.authenticate);

// Controllers
import { linkAnonymousAccountController } from './controllers/link-anonymous-account.controller';
import { verifyUserController } from './controllers/verify-user.controller';
import { paymentTokenController } from './controllers/payment-token.controller';
import { cancelSubscriptionController } from './controllers/cancel-subscription.controller';

app.use('/linkAnonymousAccount', linkAnonymousAccountController);
app.use('/verifyUser', verifyUserController);
app.use('/paymentToken', paymentTokenController);
app.use('/cancelSubscription', cancelSubscriptionController);

// Error handler
app.use((error, request, response, next) => {
    if (error === 'JsonSchemaValidationError') {
        response.status(400).json(error.validationErrors);
    }
    else {
        next();
    }
});

export const api = functions.https.onRequest(app);
