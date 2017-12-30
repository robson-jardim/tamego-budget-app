import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) {
    }

    canActivate(): Observable<boolean> {

        return this.auth.user
            .take(1)
            .map(user => !!user) // ensures the resulting type is a boolean
            .do(loggedIn => {
                if (!loggedIn) {
                    this.router.navigate(['/']);
                }
            });
    }
}


