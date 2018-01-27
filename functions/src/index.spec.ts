// const chai = require('chai');
// const assert = chai.assert;
// const chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);
// const sinon = require('sinon');
//
// describe('Cloud Functions', () => {
//
//     let configStub, adminInitStub;
//     let myFunctions, functions, admin;
//
//     before(() => {
//
//         admin = require('firebase-admin');
//
//         adminInitStub = sinon.stub(admin, 'initializeApp');
//
//         functions = require('firebase-functions');
//
//         configStub = sinon.stub(functions, 'config').returns({
//             firebase: {
//                 apiKey: 'AIzaSyCgpvPTYnEeEOCck0gJje2XbnHZH92Oi00',
//                 authDomain: 'budget-app-dev.firebaseapp.com',
//                 databaseURL: 'https://budget-app-dev.firebaseio.com',
//                 projectId: 'budget-app-dev',
//                 storageBucket: 'budget-app-dev.appspot.com',
//                 messagingSenderId: '428455197993'
//             }
//         });
//
//         myFunctions = require('./index');
//     });
//
//     after(() => {
//         configStub.restore();
//         adminInitStub.restore();
//     });
//
//     describe('CategoryValues', () => {
//         it('update', () => {
//
//             return assert.eventually.equal(myFunctions.onValueUpdate({}), true);
//         });
//     });
// });
