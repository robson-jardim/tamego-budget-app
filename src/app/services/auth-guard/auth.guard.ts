import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth-service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    // Should only be used in the constructor of the database service
    public userId: string;

    constructor(private auth: AuthService, private router: Router) {
    }

    canActivate(): Observable<boolean> {

        return this.auth.user
            .take(1)
            .do(user => {
                if(user) {
                    this.userId = user.id;
                }
            })
            .map(user => !!user) // ensures the resulting type is a boolean (true or false)
            .do(loggedIn => {
                if (!loggedIn) {
                    this.router.navigate(['/']);
                }
            });
    }
}


