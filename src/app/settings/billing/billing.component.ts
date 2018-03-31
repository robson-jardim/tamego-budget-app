import { Component, Input, OnInit } from '@angular/core';
import { User } from '@models/user.model';
import { HttpRequestService } from '@shared/services/http-request/http-request.service';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

    @Input() user: User;
    processingUnsubscription = false;

    constructor(private requestService: HttpRequestService, private notificationsService: GeneralNotificationsService) {

    }

    ngOnInit() {
    }

    public cancelSubscription() {
        this.processingUnsubscription = true;
        this.notificationsService.sendGeneralNotification('Processing...');

        this.requestService.post('api/cancelSubscription').subscribe(
            success => {
                this.notificationsService.sendGeneralNotification('Subscription cancelled');
            },
            error => {
                this.notificationsService.sendErrorNotification();
            },
            () => {
                this.processingUnsubscription = false;
            }
        );
    }
}
