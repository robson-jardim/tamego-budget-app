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
import { NavigationEnd, Router } from '@angular/router';
import { UtilityService } from '@shared/services/utility/utility.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {

    public checkUpdates;

    constructor(public snackBar: MatSnackBar,
                private notifications: GeneralNotificationsService,
                private dialogService: CloseDialogService,
                private router: Router,
                private utility: UtilityService) {
    }

    ngOnInit() {
        this.notifications.broadcast.subscribe(notification => {
            this.showSnapbar(notification);
        });

        this.checkUpdates = this.utility.combineLatestObj({
            isLogin: this.isLoginPage(),
            isUpdatesAvailable: this.isUpdatesAvailable(),
        }).subscribe(({isLogin, isUpdatesAvailable}) => {

            if (isUpdatesAvailable && !isLogin) {
                const updatesDialog: MatDialogRef<any> = this.dialogService.open(UpdateAvailableDialogComponent, {
                    disableClose: true
                });

                updatesDialog.componentInstance
                    .onUpdateDecision
                    .filter((decision: UpdateDecision) => decision === UpdateDecision.Declined)
                    .first()
                    .subscribe(() => {
                        this.checkUpdates.unsubscribe();
                    });
            }
        });

    }

    ngOnDestroy() {
        this.checkUpdates.unsubscribe();
    }

    private isLoginPage(): Observable<boolean> {
        return this.router.events.filter((event: any) => {
            return event instanceof NavigationEnd;
        }).map(event => {
            return event.url === '/';
        });
    }

    private isUpdatesAvailable(): Observable<boolean> {
        return Observable.fromPromise(window['isUpdateAvailable']);
    }

    showSnapbar(notification: Notification) {
        this.snackBar.open(notification.message, notification.action, {
            duration: notification.duration
        });
    }

}
