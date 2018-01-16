import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    constructor(public auth: AuthService, private route: Router) {
    }

    ngOnInit() {
    }

    public routeToHome() {
        this.route.navigate(['budgets']);
    }

    public routeToSettings() {
        this.route.navigate(['settings']);
    }
}
