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

app.post('/category', controllers.category);

exports.api = functions.https.onRequest(app);
