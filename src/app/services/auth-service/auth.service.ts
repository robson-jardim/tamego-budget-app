import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthNotificationService } from "../auth-notification/auth-notification.service";

export interface User {
    userId: string;
    email: string;
}

@Injectable()
export class AuthService {

    user: Observable<User>;

    constructor (private afAuth: AngularFireAuth,
                 private afs: AngularFirestore,
                 private authNotification: AuthNotificationService,
                 private router: Router) {

        this.user = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    return Observable.of(null);
                }
            });
    }

    public createUserWithEmailAndPassword (email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(user => {
                this.updateUserData(user);
            })
            .catch(error => {
                const errorCode = error.code;
                let errorMessage: string;

                if (errorCode == 'auth/email-already-in-use') {
                    errorMessage = 'Thrown if there already exists an account with the given email address.';
                }
                else if (errorCode == 'auth/weak-password') {
                    errorMessage = 'Thrown if the password is not strong enough.';
                }
                else if (errorCode == 'auth/invalid-email') {
                    errorMessage = 'Thrown if the email address is not valid.';
                }
                else if ('auth/operation-not-allowed') {
                    errorMessage = 'Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.';
                }

                this.authNotification.update(errorMessage, 'error');

                throw errorCode;
            })
    }

    public signInWithEmailAndPassword (email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(user => {
                this.updateUserData(user);
            })
            .catch(error => {
                const errorCode = error.code;
                let errorMessage: string;

                if (errorCode == 'auth/wrong-password') {
                    errorMessage = 'Thrown if the password is invalid for the given email, or the account corresponding to the email does not have a password set.';
                }
                else if (errorCode == 'auth/user-not-found') {
                    errorMessage = 'Thrown if there is no user corresponding to the given email.';
                }
                else if (errorCode == 'auth/invalid-email') {
                    errorMessage = 'Thrown if the email address is not valid.';
                }
                else if (errorCode == 'auth/user-disabled') {
                    errorMessage = 'Thrown if the user corresponding to the given email has been disabled.';
                }

                this.authNotification.update(errorMessage, 'error');

                throw errorCode;
            })
    }

    public signOut () {
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate(['/']);
        });
    }

    private updateUserData (user) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

        const data: User = {
            userId: user.uid,
            email: user.email
        };

        return userRef.set(data)
    }

}
