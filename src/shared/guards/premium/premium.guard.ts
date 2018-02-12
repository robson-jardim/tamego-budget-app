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
            if (user.isPremium) {

                const isTrialExpired = this.isTrialExpired(user.trial);
                const isTrial = user.trial.isTrial;

                if (isTrial && isTrialExpired) {
                    // This covers the case that the client has not been online since the trial ended
                    // and therefore the user document does not have the updated isPremium value
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }).do(isPremium => {
            if (!isPremium) {
                this.router.navigate(['settings']);
            }
        });
    }

    private isTrialExpired(trial) {
        const now = new Date();
        return now > trial.trialEnd;
    }
}
