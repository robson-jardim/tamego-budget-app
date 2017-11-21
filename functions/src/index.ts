const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Organize cloud functions based on logical roles
import * as create from './auth';


// Export functions you want deployed
export const createUserAccount = create.createUserAccount;

