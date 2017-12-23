import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as middleware from './middleware';
import * as express from 'express';

const app = express();
app.use(cors({origin: true}));
app.use(middleware.authenticate);
app.use(bodyParser.json());

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
