import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

interface User {
    email: string;
    uid: string;
}

@Injectable()
export class AuthService {

    user: Observable<User>;
    isAuthenticated: boolean = false;

    constructor (private afAuth: AngularFireAuth,
                 private afs: AngularFirestore,
                 private router: Router) {

        this.user = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    this.isAuthenticated = true;
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    this.isAuthenticated = false;
                    return Observable.of(null);
                }
            });
    }

    public isAuthenticated(): boolean {
        return this.isAuthenticated;
    }

    public createUserWithEmailAndPassword (email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(user => {
                console.log('Successful account creation');
                this.updateUserData(user);
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error(errorMessage);
                console.error(errorCode);
            })

    }

    public loginUserWithEmailAndPassword (email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(user => {
                console.log('Successful login');
                this.updateUserData(user);
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error(errorMessage);
                console.error(errorCode);
            });
    }

    public signOutUser () {
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate(['/']);
        });
    }

    private updateUserData (user) {

        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

        const data: User = {
            uid: user.uid,
            email: user.email
        };

        return userRef.set(data)
    }

}
