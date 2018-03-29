import { Injectable } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { HttpRequestService } from '@shared/services/http-request/http-request.service';

@Injectable()
export class PaymentService {

    constructor(private auth: AuthService, private requestService: HttpRequestService) {
    }

    public addPaymentMethod(token: any) {
        const tokenId = token.id;

        const data = { paymentToken: tokenId };

        this.requestService.post(`api/paymentToken`, data).subscribe(x => {
            console.log(x);
        });
    }

}
