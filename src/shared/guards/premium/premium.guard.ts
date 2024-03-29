import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '@shared/services/auth/auth.service';

@Injectable()
export class PremiumGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.user
            .first()
            .map(user => user.premium.active)
            .do(isPremium => {
                if (!isPremium) {
                    this.router.navigate(['settings'], {replaceUrl: true});
                }
            });
    }
}

