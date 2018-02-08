import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthNotificationService } from '../auth-notification/auth-notification.service';
import { User } from '@models/user.model';
import { HttpRequestService } from '../http-request/http-request.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/pairwise';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {

    public user: Observable<User>;
    private verifiedSubscription: Subscription;

    constructor(private afAuth: AngularFireAuth,
                private afs: AngularFirestore,
                private authNotification: AuthNotificationService,
                private router: Router,
                private requestService: HttpRequestService) {

        this.user = this.afAuth.authState.switchMap(user => {

            if (user) {
                return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
            }
            else {
                return Observable.of(null);
            }

        });

        Observable.combineLatest(this.user, this.afAuth.authState, (user, authState) => {
            if (user && !user.email && authState && !authState.isAnonymous) {
                return true;
            }
            else {
                return false;
            }
        }).filter(result => result === true)
            .flatMap(() => {
                return this.requestService.post('api/setEmailOnUser');
            }).subscribe(x => console.log(x));

        // If open in multiple tabs, and one tab logs out, log out in all tabs
        this.userLoggedOutEvent().subscribe(res => {
            this.router.navigate(['/']);
        });

        this.verifiedSubscription = this.userLoggedInEvent().subscribe(res => {
            // verifyUser is called twice if email verification is successful because the user observable emits a
            // new value because once the user document updates. To get out this, a watcher is set and unsubscribed
            // after a successful user document change.
            this.verifyUser();
        });
    }

    public async sendEmailVerification(showOfflinePopup = false) {
        try {
            await this.afAuth.auth.currentUser.sendEmailVerification();
        } catch (error) {

            if (showOfflinePopup) {
                this.requestService.openOfflineDialog();
            }

            console.error(error);
        }
    }

    public verifyUser(forceRefreshToken = false, showOfflinePopups = false) {

        this.userSnapshot().subscribe(async user => {

            const verificationEmailComplete = () => {
                return this.afAuth.auth.currentUser.emailVerified;
            };

            const verificationProcessComplete = () => {
                return user.emailVerified;
            };

            if (verificationProcessComplete()) {
                return;
            }

            if (forceRefreshToken) {
                try {
                    // The server checks the email verified property encoded in the JWT.
                    // If the user recently completed the verification email, the current JWT
                    // will contain old values unless refreshed.
                    await this.afAuth.auth.currentUser.reload();
                    await this.afAuth.auth.currentUser.getIdToken(true);
                }
                catch (error) {
                    console.error(error);
                    if (showOfflinePopups) {
                        this.requestService.openOfflineDialog();
                    }
                    return;
                }
            }

            if (!verificationEmailComplete()) {
                return;
            }

            this.requestService.post('api/verifyUser', undefined, showOfflinePopups).subscribe(
                response => {
                    // Unsubscribes to the verified watcher because once the user document changes
                    // the observable will emit a value continuing to enter verify user
                    this.verifiedSubscription.unsubscribe();
                }, error => {
                    console.error(error);
                });
        });
    }

    public userSnapshot(): Observable<User> {
        return this.user.first(x => x != null);
    }

    public userLoggedInEvent(): Observable<any> {
            return this.user.filter(user => user != null).map(() => undefined);
    }

    public userLoggedOutEvent(): Observable<any> {

        return this.user
            .pairwise()
            .map(([previouslyLoggedIn, currentlyLoggedIn]) => {
                if (previouslyLoggedIn && !currentlyLoggedIn) {
                    return true;
                }
                else {
                    return false;
                }
            }).filter(Boolean)
            .map(() => undefined);
    }

    public async linkAnonymousAccountToEmail(email: string, password: string) {

        const credential = firebase.auth.EmailAuthProvider.credential(email, password);

        this.afAuth.auth.currentUser.linkWithCredential(credential).then(account => {
            this.requestService.post('api/setEmailOnUser').subscribe();
            this.afAuth.auth.currentUser.sendEmailVerification();
        });
    }

    public async createUserWithEmailAndPassword(email: string, password: string) {
        try {
            const user = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
            this.sendEmailVerification(); // Success of this operation is not important. No need to catch the returned promise
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
            else if (errorCode === 'auth/network-requestService-failed') {
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
            else if (errorCode === 'auth/network-requestService-failed') {
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
