import * as admin from 'firebase-admin';

export const authenticate = async (request, response, next) => {

    if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
        return response.status(400)
    }

    try {
        const idToken = request.headers.authorization.split('Bearer ')[1];
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        request.user = decodedIdToken;

        next();
    } catch (error) {
        return response.status(401);
    }
};
