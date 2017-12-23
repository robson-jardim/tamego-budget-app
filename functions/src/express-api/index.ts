import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as middleware from './middleware';
import * as express from 'express';

const app = express();

const whitelist = [
    'http://localhost:4200',
    'https://budget-app-dev.firebaseapp.com',
    'https://budget-app-staging-1.firebaseapp.com',
    'https://budget-app-prod.firebaseapp.com',
    'https://app.tamego.com'
];

const corsOptions = {
    origin: function (origin, callback) {
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
import { verifyUserController } from './controllers/verifyUserController';

app.use('/verifyUser', verifyUserController);

// Error handler
app.use((error, request, response, next) => {
    if (error === 'JsonSchemaValidationError') {
        response.status(400).json(error.validationErrors);
    }
    else {
        next();
    }
});

export const expressApi = app;
