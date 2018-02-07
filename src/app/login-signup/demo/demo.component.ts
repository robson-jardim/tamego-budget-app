import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
    selector: 'app-demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

    constructor(private afAuth: AngularFireAuth) {
    }

    ngOnInit() {
    }

    public createAnonymousAccount() {
        this.afAuth.auth.signInAnonymously().then(account => {
            console.log('Anonymous Account', account);
        });
    }

    public linkAnonymousAccountToEmail(email: string, password: string) {

        const credential = firebase.auth.EmailAuthProvider.credential(email, password);

        this.afAuth.auth.currentUser.linkWithCredential(credential).then(account => {
            console.log('Account linked', account);
            // this.afAuth.auth.currentUser.sendEmailVerification();
        });
    }

}
