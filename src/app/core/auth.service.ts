import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

interface User {
    uid: string;
    email: string;
    displayName?: string;
}

@Injectable()
export class AuthService {

    user: Observable<User>;

    constructor (private afAuth: AngularFireAuth,
                 private afs: AngularFirestore,
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
        this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode == 'auth/email-already-in-use') {

                }
                else if (errorCode == 'auth/invalid-email') {

                }
                else if (errorCode == 'auth/weak-password') {

                }
            });
    }


    googleLogin () {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.oAuthLogin(provider);
    }

    private oAuthLogin (provider) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {
                this.updateUserData(credential.user)
            })
    }

    private updateUserData (user) {
        // Sets user data to firestore on login
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
        const data: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
        };

        return userRef.set(data)
    }

    signOut () {
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate(['/']);
        });
    }

}
