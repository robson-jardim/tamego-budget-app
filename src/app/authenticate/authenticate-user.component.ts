import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { AuthNotificationService } from '@shared/services/auth-notification/auth-notification.service';

@Component({
    selector: 'app-authenticate',
    templateUrl: './authenticate-user.component.html',
    styleUrls: ['./authenticate-user.component.scss']
})
export class AuthenticateComponent implements OnInit {

    constructor(private auth: AuthService,
                private router: Router,
                public authNotification: AuthNotificationService) {
    }

    ngOnInit() {
        this.onLoginRouteToBudgets();
    }

    private onLoginRouteToBudgets() {
        this.auth.user.first(x => x != null).subscribe(user => {
            this.router.navigate(['/budgets']);
        });
    }

}
