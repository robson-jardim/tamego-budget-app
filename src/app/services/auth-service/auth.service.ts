import { Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthNotificationService } from '../auth-notification/auth-notification.service';
import { User } from '../../../../models/user.model';
import 'rxjs/add/operator/switchMap';
import { RequestService } from '../request/request.service';

@Injectable()
export class AuthService {

    public user: Observable<User>;

    constructor(private afAuth: AngularFireAuth,
                private afs: AngularFirestore,
                private authNotification: AuthNotificationService,
                private router: Router,
                private requestService: RequestService) {


        this.user = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    return Observable.of(null);
                }
            });

        // If one tab logs out, navigate to root page
        this.userLoggedOut().subscribe(() => {
            this.router.navigate(['/']);
        });
    }

    public verifyUser() {

        this.userLoggedIn().subscribe(async (user: User) => {

            const docVerifiedState = () => {
                return user.emailVerified;
            };

            await this.forceRefreshToken();

            this.requestService.post('api/verifyUser').subscribe(
                response => {
                    console.log(response);
                },
                error => {
                    console.error(error);
                });
        });
    }


    public userLoggedIn(): Observable<User> {
        return this.user.first(user => user != null);
    }

    public userLoggedOut(): Observable<any> {
        // Returns a null observable
        return this.user.first(user => user == null);
    }

    public forceRefreshToken() {
        return this.afAuth.auth.currentUser.getIdToken(true);
    }

    public async createUserWithEmailAndPassword(email: string, password: string) {
        try {
            const user = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
            await this.afAuth.auth.currentUser.sendEmailVerification();
            return user;
        }
        catch (error) {
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
            else if (errorCode === 'auth/network-request-failed') {
                errorMessage = 'Offline';
            }
            else {
                errorMessage = 'Error';
            }

            this.authNotification.update(errorMessage, 'error');

            throw error;
        }
    }

    public async signInWithEmailAndPassword(email: string, password: string) {
        try {
            return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
        }
        catch (error) {
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
            else if (errorCode === 'auth/network-request-failed') {
                errorMessage = 'Offline';
            }
            else {
                errorMessage = 'Error';
            }

            this.authNotification.update(errorMessage, 'error');

            throw error;
        }
    }

    public async signOut() {
        try {
            await this.afAuth.auth.signOut();
            await this.router.navigate(['/']);
        } catch (error) {
            console.error(error);
        }
    }
}
