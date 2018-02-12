import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import {
    GeneralNotificationsService,
    Notification
} from '@shared/services/general-notifications/general-notifications.service';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import {
    UpdateAvailableDialogComponent,
    UpdateDecision
} from './update-available-dialog/update-available-dialog.component';
import { Observable } from 'rxjs/Observable';
import { Event, NavigationEnd, Router } from '@angular/router';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {

    public updatesSubscription: Subscription;
    private notificationSubscription: Subscription;

    constructor(public snackBar: MatSnackBar,
                private notifications: GeneralNotificationsService,
                private dialogService: CloseDialogService,
                private router: Router,
                private utility: UtilityService,
                private auth: AuthService) {
    }

    ngOnInit() {
        this.checkForUpdates();
        this.enableGlobalAppNotifications();
    }

    ngOnDestroy() {
        this.updatesSubscription.unsubscribe();
        this.notificationSubscription.unsubscribe();
    }

    private isAuthenticatePage(): Observable<boolean> {
        return this.router.events.filter((event: any) => {
            return event instanceof NavigationEnd;
        }).map(event => {
            return event.url === '/signin' || event.url === '/signup';
        });
    }

    private isUpdatesAvailable(): Observable<boolean> {
        // Service worker is not enabled in development, so update check
        // is not defined
        if (window['isUpdateAvailable']) {
            return Observable.fromPromise(window['isUpdateAvailable']);
        }
        else {
            return Observable.of(false);
        }
    }

    private showSnapbar(notification: Notification) {
        this.snackBar.open(notification.message, notification.action, {
            duration: notification.duration
        });
    }

    private checkForUpdates() {

        this.updatesSubscription = this.utility.combineLatestObj({
            isAuthenticatePage: this.isAuthenticatePage(),
            isUpdatesAvailable: this.isUpdatesAvailable(),
        }).subscribe(({isAuthenticatePage, isUpdatesAvailable}) => {

            if (isUpdatesAvailable && !isAuthenticatePage) {
                const updatesDialog: MatDialogRef<any> = this.dialogService.open(UpdateAvailableDialogComponent, {
                    disableClose: true
                });

                updatesDialog.componentInstance
                    .onUpdateDecision
                    .filter(isUpdateDeclined)
                    .first()
                    .subscribe(() => {
                        this.updatesSubscription.unsubscribe();
                    });
            }

            function isUpdateDeclined(decision: UpdateDecision) {
                return decision === UpdateDecision.Declined;
            }

        });
    }

    private enableGlobalAppNotifications() {
        this.notificationSubscription = this.notifications.broadcast.subscribe(notification => {
            this.showSnapbar(notification);
        });
    }

}
