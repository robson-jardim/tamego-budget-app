import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'app-login-signup',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit {
    items: Observable<any[]>;

    constructor (public angularFireAuth: AngularFireAuth, db: AngularFirestore) {
        this.items = db.collection('items').valueChanges();
    }

    ngOnInit () {
        this.angularFireAuth.auth.onAuthStateChanged(user => {
            console.log(user);
        });

    }

    login () {
        this.angularFireAuth.auth.signInWithPopup(
            new firebase.auth.GoogleAuthProvider()
        );
    }

    logout () {
        this.angularFireAuth.auth.signOut();
    }
}
