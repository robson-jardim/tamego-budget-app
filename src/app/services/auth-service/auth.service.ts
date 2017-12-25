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
import 'rxjs/add/operator/filter';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

    public user: Observable<User>;
    private verifiedWatcher;

    constructor(private afAuth: AngularFireAuth,
                private afs: AngularFirestore,
                private authNotification: AuthNotificationService,
                private router: Router,
                private requestService: RequestService,
                private http: HttpClient) {


        this.user = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    return Observable.of(null);
                }
            });


        // If open in multiple tabs, and one tab logs out, log out in all tabs
        this.userLoggedOutEvent().subscribe(res => {
            console.log('Logged out');
            this.router.navigate(['/']);
        });

        this.verifiedWatcher = this.userLoggedInEvent().subscribe(res => {
            // verifyUser is called twice if email verification is successful because the user observable emits a
            // new value because once the user document updates. To get out this, a watcher is set and unsubscribed
            // after a successful user document change.
            this.verifyUser();
        });
    }

    public sendEmailVerification() {
        return this.afAuth.auth.currentUser.sendEmailVerification();
    }

    public verifyUser(forceRefreshToken = false) {

        this.userSnapshot().subscribe(async user => {

            const verificationComplete = () => {
                return user.emailVerified;
            };

            const userVerifiedState = () => {
                return this.afAuth.auth.currentUser.emailVerified;
            };

            const completedVerificationEmail = () => {
                return userVerifiedState();
            };

            if (verificationComplete()) {
                return;
            }

            if (forceRefreshToken && !userVerifiedState()) {
                try {
                    // The server checks the email verified property encoded in the JWT.
                    // If the user recently completed the verification email, the current JWT
                    // will contain old values unless refreshed.
                    await this.afAuth.auth.currentUser.reload();
                    await this.afAuth.auth.currentUser.getIdToken(true);
                }
                catch (error) {
                    console.error(error);
                    return;
                }
            }

            if (!completedVerificationEmail()) {
                return;
            }

            this.http.post(environment.functions + 'api/verifyUser', {}).first().subscribe(
                response => {

                    this.verifiedWatcher.unsubscribe();
                    // Unsubscribes to the verified watcher because once the user document changes
                    // the observable will emit a value continuing to enter verify user
                    console.log(response);
                },
                error => {
                    console.error('Offline erro 2', error);
                }
            );
        });
    }

    public userSnapshot(): Observable<User> {
        return this.user.first(x => x != null);
    }

    public userLoggedInEvent(): Observable<any> {
        return this.user.filter(user => user != null).map(() => {
            return undefined;
        });
    }

    public userLoggedOutEvent(): Observable<any> {
        return this.user.filter(user => user == null).map(() => {
            return undefined;
        });
    }

    public async createUserWithEmailAndPassword(email: string, password: string) {
        try {
            const user = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
            await this.sendEmailVerification();
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
