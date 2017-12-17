import * as bodyParser from 'body-parser';
import * as express from 'express';

const app = express();
app.use(bodyParser.json());
const router = express.Router();
app.use('/admin/api', router);

// Controllers
import { usersController } from './controllers/usersController';

router.use('/users', usersController);

app.listen(3000, () => console.log('Admin functions listening on port 3000');

export const api = app;
