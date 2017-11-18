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

    constructor(private afAuth: AngularFireAuth,
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

    public createUserWithEmailAndPassword(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(user => {
                this.updateUserData(user);
            })
            .catch(error => {
                const errorCode = error.code;
                let errorMessage: string;

                if (errorCode == 'auth/email-already-in-use') {
                    errorMessage = 'Email already in use';
                }
                else if (errorCode == 'auth/weak-password') {
                    errorMessage = 'Weak password';
                }
                else if (errorCode == 'auth/invalid-email') {
                    errorMessage = 'Invalid email';
                }

                this.authNotification.update(errorMessage, 'error');

                throw error;
            })
    }

    public signInWithEmailAndPassword(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(user => {
                this.updateUserData(user);
            })
            .catch(error => {
                const errorCode = error.code;
                let errorMessage: string;

                if (errorCode == 'auth/wrong-password') {
                    errorMessage = 'Incorrect password';
                }
                else if (errorCode == 'auth/user-not-found') {
                    errorMessage = 'No account found with the given email';
                }
                else if (errorCode == 'auth/user-disabled') {
                    errorMessage = 'This account has been disabled';
                }

                this.authNotification.update(errorMessage, 'error');

                throw error;
            })
    }

    public signOut() {
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate(['/']);
        });
    }

    private updateUserData(user) {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

        const data: User = {
            userId: user.uid,
            email: user.email
        };

        return userRef.set(data)
    }

}
