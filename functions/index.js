// Firebase
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const middleware = require("./middleware/authenticate");
const ValidationError = require("express-json-validator-middleware");
const app = express();

// Middleware
app.use(cors({origin: true}));
app.use(middleware.authenticate);
app.use(bodyParser.json());

// Controllers
const categoryGroupController = require('./controllers/categoryController');

// Routes
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

exports.api = functions.https.onRequest(app);
