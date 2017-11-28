const admin = require('firebase-admin');

exports.authenticate = (request, response, next) => {
    if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
        response.status(403).send('No header');
        return;
    }
    const idToken = request.headers.authorization.split('Bearer ')[1];
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
        request.user = decodedIdToken;
        next();
    }).catch(error => {
        response.status(403).send('Old header');
    });
};
