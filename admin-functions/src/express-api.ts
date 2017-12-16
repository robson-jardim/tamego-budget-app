import * as bodyParser from 'body-parser';
import * as express from 'express';

const app = express();
app.use(bodyParser.json());

// Controllers
import { usersController } from './controllers/usersController';

app.use('/users', usersController);
app.listen(3000, () => console.log('Admin functions listening on port 3000'));

export const api = app;
