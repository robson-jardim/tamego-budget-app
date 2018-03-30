import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class SignedOutGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot) {

        return this.auth.user
            .first()
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
                    this.router.navigate(['/budgets'], {replaceUrl: true});
                }
            });
    }
}
