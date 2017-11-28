const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const middleware = require("./middleware/authenticate");

const controllers = require("./controllers/category");


const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true}));
app.use(middleware.authenticate);

const { Validator, ValidationError } = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;

const categoryTransferSchema = {
    type: 'object',
    required: ['from', 'to', 'budgetId'],
    properties: {
        from: {
            type: 'string'
        },
        to: {
            type: 'string'
        },
        budgetId: {
            type: 'string'
        }
    }
};

app.post('/category', validate({body: categoryTransferSchema}), controllers.category);

exports.api = functions.https.onRequest(app);
