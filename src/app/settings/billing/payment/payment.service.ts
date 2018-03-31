import { Injectable } from '@angular/core';
import { AuthService } from 'shared/services/auth/auth.service';
import { HttpRequestService } from 'shared/services/http-request/http-request.service';
import { GeneralNotificationsService } from 'shared/services/general-notifications/general-notifications.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PaymentService {

    constructor(private auth: AuthService, private requestService: HttpRequestService, private notificationsService: GeneralNotificationsService) {
    }

    public addPaymentMethod(token: any) {

        const tokenId = token.id;
        const data = { paymentToken: tokenId };

        this.auth.user.first()
            .map(user => !!user.cardDetails)
            .flatMap(isUpdatingCreditCard => {
                this.notificationsService.sendProcessingNotification();

                return this.requestService.post(`api/paymentToken`, data).map(() => {
                    if (isUpdatingCreditCard) {
                        this.notificationsService.sendGeneralNotification('Updated credit card');
                    } else {
                        this.notificationsService.sendGeneralNotification('Added credit card');
                    }
                });
            }).catch(error => {
                this.notificationsService.sendErrorNotification();
                return Observable.of(null);
            }).subscribe();
    }

}
