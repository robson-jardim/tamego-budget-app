import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthNotificationService } from '../auth-notification/auth-notification.service';
import { TemporaryStartupUser, User } from '@models/user.model';
import { HttpRequestService } from '../http-request/http-request.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/pairwise';
import * as firebase from 'firebase';
import { DemoService } from '../../../app/demo/demo/demo.service';

@Injectable()
export class AuthService {

    public user: Observable<User>;
    private verifiedSubscription: Subscription;

    constructor(private afAuth: AngularFireAuth,
                private afs: AngularFirestore,
                private authNotification: AuthNotificationService,
                private router: Router,
                private requestService: HttpRequestService,
                private demo: DemoService) {

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
        }).filter(Boolean)
            .flatMap(() => {
                return this.requestService.post('api/linkAnonymousAccount');
            }).subscribe();

        // If open in multiple tabs, and one tab logs out, log out in all tabs
        this.userLoggedOutEvent().subscribe(res => {
            // TODO - move to signed out dialog
            this.router.navigate(['/signin']);
        });

        this.verifiedSubscription = this.user.filter(x => x != null).subscribe(user => {
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

        this.user.first(x => x != null).subscribe(async user => {

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

            const noData = {};

            this.requestService.post('api/verifyUser', noData, showOfflinePopups).subscribe(
                response => {
                    // Unsubscribes to the verified watcher because once the user document changes
                    // the observable will emit a value continuing to enter verify user
                    this.verifiedSubscription.unsubscribe();
                }, error => {
                    console.error(error);
                });
        });
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

        try {
            await this.afAuth.auth.currentUser.linkWithCredential(credential);
            this.requestService.post('api/linkAnonymousAccount').subscribe();
            await this.sendEmailVerification();
        } catch (error) {
            this.signUpAuthErrorHandler(error);
            throw error;
        }
    }

    public async createUserWithEmailAndPassword(email: string, password: string): Promise<any> {
        try {
            const user = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
            await this.createUserDocument(user);

            // Do not await to allow for faster startup time for demo
            this.demo.createDemo(user.uid);

            // Success of this operation is not important. No need to catch the returned promise
            this.sendEmailVerification();

            return user;
        }
        catch (error) {
            this.signUpAuthErrorHandler(error);
            throw error;
        }
    }

    public async signInWithEmailAndPassword(email: string, password: string) {
        try {
            return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
        }
        catch (error) {
            this.signInAuthErrorHandler(error);
            throw error;
        }
    }

    public sendResetPasswordResetEmail(email: string) {
        return Observable.fromPromise(this.afAuth.auth.sendPasswordResetEmail(email));
    }

    public async signOut() {
        try {
            await this.afAuth.auth.signOut();
            await this.router.navigate(['/signin']);
        } catch (error) {
            console.error(error);
        }
    }

    private signInAuthErrorHandler(error) {
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
            errorMessage = 'Internet connection required';
        }
        else {
            errorMessage = 'Error';
        }

        this.authNotification.update(errorMessage, 'error');
    }

    private signUpAuthErrorHandler(error) {
        const errorCode = error.code;
        let errorMessage: string;

        if (errorCode === 'auth/email-already-in-use') {
            errorMessage = 'Email is registered to another account';
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
            errorMessage = 'Internet connection required';
        }
        else {
            errorMessage = 'Error';
        }

        this.authNotification.update(errorMessage, 'error');

    }

    public async createAnonymousAccount(): Promise<any> {
        const anonymousUser = await this.afAuth.auth.signInAnonymously();

        await this.createUserDocument(anonymousUser);

        // Do not await to allow for faster startup time for demo
        this.demo.createDemo(anonymousUser.uid);

        return anonymousUser;
    }

    private async createUserDocument(user: any): Promise<TemporaryStartupUser> {
        const tempUser: TemporaryStartupUser = {
            userId: user.uid,
            email: user.email,
            premium: {
                active: true
            }
        };

        await this.afs.doc(`users/${tempUser.userId}`).set(tempUser);
        return tempUser;
    }
}
