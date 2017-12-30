import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import {
    GeneralNotificationsService,
    Notification
} from '../shared/services/general-notifications/general-notifications.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    constructor(public snackBar: MatSnackBar,
                private notification: GeneralNotificationsService) {
    }

    ngOnInit() {
        this.notification.broadcast.subscribe(notification => {
            this.showSnapbar(notification);
        });
    }

    showSnapbar(notification: Notification) {

        this.snackBar.open(notification.message, notification.action, {
            duration: notification.duration
        });
    }


}
