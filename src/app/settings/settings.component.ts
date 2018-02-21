import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '@shared/services/auth/auth.service';
import { LinkAnonymousAccountDialogComponent } from '@shared/components/link-anonymous-account-dialog/link-anonymous-account-dialog.component';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    public forceRefreshToken = true;
    public showOfflinePopups = true;

    constructor(public auth: AuthService, private dialogService: CloseDialogService) {
    }

    ngOnInit() {
        this.auth.verifyUser(this.forceRefreshToken);
    }

    public openLinkAnonymousAccountDialog() {
        this.dialogService.open(LinkAnonymousAccountDialogComponent, {
            width: '400px',
            maxWidth: '400px'
        });
    }

}
