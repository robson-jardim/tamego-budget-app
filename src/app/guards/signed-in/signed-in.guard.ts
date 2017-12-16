import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth-service/auth.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class SignedInGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot) {

        return this.auth.user
            .take(1)
            .map(user => !!user) // ensures the resulting type is a boolean
            .map(loggedIn => {
                if (loggedIn) {
                    // Don't allow access to this route if user is logged in
                    return false;
                } else {
                    return true;
                }
            })
            .do(loggedIn => {
                if (!loggedIn) {
                    this.router.navigate(['/budgets']);
                }
            });
    }
}
