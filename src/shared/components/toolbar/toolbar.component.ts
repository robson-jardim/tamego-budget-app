import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

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
