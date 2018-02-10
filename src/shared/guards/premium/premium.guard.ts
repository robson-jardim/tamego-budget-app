import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '@shared/services/auth/auth.service';

@Injectable()
export class PremiumGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.user.first().map(user => {
            return user.isPremium;
        }).do(isPremium => {
            if (!isPremium) {
                this.router.navigate(['settings'], {queryParams: {trialOver: true}});
            }
        });
    }
}
