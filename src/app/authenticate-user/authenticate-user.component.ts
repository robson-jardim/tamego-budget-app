import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/merge';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-authenticate',
    templateUrl: './authenticate-user.component.html',
    styleUrls: ['./authenticate-user.component.scss']
})
export class AuthenticateComponent implements OnInit, OnDestroy {

    public isPasswordResetPage$: Observable<boolean>;
    private userSigninSubscription: Subscription;

    constructor(private auth: AuthService,
                private router: Router) {
    }

    ngOnInit() {
        this.isPasswordResetPage$ = this.isPasswordResetPage();

        this.userSigninSubscription = this.onUserSignin().subscribe(() => {
            this.router.navigate(['/budgets']);
        });
    }

    ngOnDestroy() {
        this.userSigninSubscription.unsubscribe();
    }

    private isPasswordResetPage() {
        // Emits load in route, and routes on navigation events
        const loadinRoute = Observable.of(this.router.url);
        const navigationRoute = this.router.events.filter((event: any) => event instanceof NavigationEnd).map(event => event.url);

        return loadinRoute.merge(navigationRoute).map(url => {
            return url === '/password_reset';
        });
    }

    private onUserSignin() {
        return this.auth.user.first(x => x != null);
    }
}
