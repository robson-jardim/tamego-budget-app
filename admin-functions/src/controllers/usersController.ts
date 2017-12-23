import * as admin from 'firebase-admin';
import * as express from 'express';

const router = express.Router();
const db = admin.firestore();
const auth = admin.auth();

// DELETE: /users
router.delete('/', async (request, response) => {

    const promises = [];

    function listAllUsers(nextPageToken) {
        const promise = auth.listUsers(1000, nextPageToken)
            .then((listUsersResult) => {
                listUsersResult.users.forEach((user) => {
                    deleteUser(user.uid);
                });
                if (listUsersResult.pageToken) {
                    listAllUsers(listUsersResult.pageToken);
                }
            })
            .catch((error) => {
                console.log('Error listing users:', error);
                throw error;
            });

        promises.push(promise);
    }

    function deleteUser(userId) {
        const promise = auth.deleteUser(userId)
            .then(function () {
                console.log('Successfully deleted user', userId);
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
                throw error;
            });
        promises.push(promise);
    }

    try {
        listAllUsers({});
        await Promise.all(promises);
        return response.status(200).send('All users deleted');
    }
    catch (error) {
        return response.status(500).send('Error');
    }

});


export const usersController = router;
