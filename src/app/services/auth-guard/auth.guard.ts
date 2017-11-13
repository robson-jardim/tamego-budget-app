import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from "rxjs/Observable";
import { AuthService } from "../auth-service/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor (private afAuth: AngularFireAuth, private router: Router) {
    }

    canActivate (): Observable<boolean> {

        // Code from: https://github.com/erikhaddad/firechat/blob/master/src/app/auth/auth.guard.ts
        return this.afAuth.authState
            .take(1)
            .map(authState => !!authState) //ensures the resulting type is a boolean (true or false)
            .do(authenticated => {
                if (!authenticated) {
                    this.router.navigate(['/']);
                }
            });
    }
}


