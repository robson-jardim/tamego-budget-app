import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import * as express from 'express';
admin.initializeApp(functions.config().firebase);

import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { authenticate} from './authenticate';
import { categoryGroupController } from './controllers/categoryController';

const app = express();
app.use(cors({origin: true}));
app.use(authenticate);
app.use(bodyParser.json());

app.use('/categoryGroups', categoryGroupController);

// Error handler
app.use((error, request, response, next) => {
    if (error == 'JsonSchemaValidationError') {
        response.status(400).json(error.validationErrors);
    }
    else {
        next();
    }
});

export const api = functions.https.onRequest(app);

