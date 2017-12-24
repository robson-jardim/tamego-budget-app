import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';

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
