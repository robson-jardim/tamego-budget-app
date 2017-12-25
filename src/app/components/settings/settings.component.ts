import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    public forceRefreshToken = true;
    public showOfflinePopups = true;

    constructor(public auth: AuthService) {
    }

    ngOnInit() {
        this.auth.verifyUser(this.forceRefreshToken);
    }

}
