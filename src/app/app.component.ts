import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import {
    GeneralNotificationsService,
    Notification
} from '@shared/services/general-notifications/general-notifications.service';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { UpdateAvailableDialogComponent } from './update-available-dialog/update-available-dialog.component';
import { Observable } from 'rxjs/Observable';
import { NavigationEnd, Router } from '@angular/router';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

    private notificationSubscription: Subscription;

    constructor(public snackBar: MatSnackBar,
                private notifications: GeneralNotificationsService,
                private dialogService: CloseDialogService,
                private router: Router,
                private utility: UtilityService,
                private auth: AuthService) {
    }

    ngOnInit() {
        // this.checkForUpdates();
        this.enableGlobalAppNotifications();
    }

    private isAuthenticatePage(): Observable<boolean> {
        return this.router.events.filter((event: any) => {
            return event instanceof NavigationEnd;
        }).map(event => {
            return event.url === '/signin' || event.url === '/signup' || event.url === '/password_reset';
        });
    }

    ngOnDestroy() {
        this.notificationSubscription.unsubscribe();
    }

    private isUpdatesAvailable(): Observable<boolean> {
        // Service worker is not enabled in development, so isUpdateAvailable promise not resolve during development
        return Observable.fromPromise(window['isUpdateAvailable']);
    }

    private showSnackbar(notification: Notification) {
        this.snackBar.open(notification.message, notification.action, {
            duration: notification.duration
        });
    }

    private checkForUpdates() {
        this.utility.combineLatestObj({
            isAuthenticatePage: this.isAuthenticatePage(),
            isUpdatesAvailable: this.isUpdatesAvailable(),
        }).filter(({isAuthenticatePage, isUpdatesAvailable}) => {
            return !isAuthenticatePage && isUpdatesAvailable;
        }).first().subscribe(() => {
            this.openUpdateAvailableDialog();
        });
    }

    private openUpdateAvailableDialog() {
        this.dialogService.open(UpdateAvailableDialogComponent, {
            disableClose: true,
            minWidth: '210px',
        });
    }

    private enableGlobalAppNotifications() {
        this.notificationSubscription = this.notifications.broadcast.subscribe(notification => {
            this.showSnackbar(notification);
        });
    }

}
