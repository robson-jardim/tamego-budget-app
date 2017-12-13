import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthNotificationService } from '../auth-notification/auth-notification.service';
import { User } from '../../../../models/user.model';

@Injectable()
export class AuthService {

    public user: Observable<User>;

    constructor(private afAuth: AngularFireAuth,
                private afs: AngularFirestore,
                private authNotification: AuthNotificationService,
                private router: Router) {

        // this.afAuth.idToken.subscribe(console.log);

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
            .catch(error => {
                const errorCode = error.code;
                let errorMessage: string;

                if (errorCode === 'auth/email-already-in-use') {
                    errorMessage = 'Email is already registered with another account';
                }
                else if (errorCode === 'auth/invalid-email') {
                    errorMessage = 'Invalid email';
                }
                else if (errorCode === 'auth/operation-not-allowed') {
                    errorMessage = 'Error';
                }
                else if (errorCode === 'auth/weak-password') {
                    errorMessage = 'Please choose a more secure password';
                }
                else {
                    errorMessage = 'Error';
                }

                this.authNotification.update(errorMessage, 'error');

                throw error;
            });
    }

    public signInWithEmailAndPassword(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                const errorCode = error.code;
                let errorMessage: string;

                if (errorCode === 'auth/invalid-email') {
                    errorMessage = 'Invalid email';
                }
                else if (errorCode === 'auth/user-disabled') {
                    errorMessage = 'This account has been disabled';
                }
                else if (errorCode === 'auth/user-not-found') {
                    errorMessage = 'No account exists with the given email';
                }
                else if (errorCode === 'auth/wrong-password') {
                    errorMessage = 'Incorrect password';
                }
                else {
                    errorMessage = 'Error';
                }

                this.authNotification.update(errorMessage, 'error');

                throw error;
            });
    }

    public signOut() {
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate(['/']);
        });
    }
}
