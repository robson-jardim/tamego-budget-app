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
    // private x;

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

        this.userLoggedInEvent().subscribe(res => {
        // this.x = this.userLoggedInEvent().subscribe(res => {
            // Called twice on force because
            this.verifyUser();
        });
    }

    public verifyUser(forceRefresh = false) {

        this.userSnapshot().subscribe(async user => {

            console.log('Attempt');
            const verificationComplete = () => {
                return user.emailVerified;
            };

            const userVerifiedState = () => {
                return this.afAuth.auth.currentUser.emailVerified;
            };

            if (verificationComplete()) {
                console.log('User has completed verification process already');
                return;
            }

            if (forceRefresh && !userVerifiedState()) {
                try {
                    // The server checks the email verified property encoded in the JWT.
                    // If the user recently completed the verification email, the current JWT
                    // will contain old values unless refreshed.
                    await this.afAuth.auth.currentUser.reload();
                    await this.afAuth.auth.currentUser.getIdToken(true);
                    // this.x.unsubscribe();
                }
                catch (error) {
                    console.error('error 1', error);
                    return;
                }
            }

            if (!userVerifiedState()) {
                console.log('User has not completed email');
                return;
            }

            // This is being called twice again after logging out after verification
            this.http.post(environment.functions + 'api/verifyUser', {}).first().subscribe(
                response => {
                    console.log(response);
                },
                error => {
                    console.error('error 2', error);
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
