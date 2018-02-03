import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import {
    GeneralNotificationsService,
    Notification
} from '@shared/services/general-notifications/general-notifications.service';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { UpdateAvailableDialogComponent } from './update-available-dialog/update-available-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    constructor(public snackBar: MatSnackBar,
                private notification: GeneralNotificationsService,
                private dialogService: CloseDialogService) {
    }

    ngOnInit() {
        this.notification.broadcast.subscribe(notification => {
            this.showSnapbar(notification);
        });

        window['isUpdateAvailable']
            .then(isAvailable => {
                if (isAvailable) {
                    this.dialogService.open(UpdateAvailableDialogComponent);
                }
            });
    }

    showSnapbar(notification: Notification) {

        this.snackBar.open(notification.message, notification.action, {
            duration: notification.duration
        });
    }


}
