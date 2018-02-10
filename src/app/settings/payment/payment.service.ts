import { Injectable } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';

@Injectable()
export class PaymentService {

    constructor(private auth: AuthService) {

    }

    public addPaymentMethod(token: any) {
        console.log(token);
        // set document on payments
    }

}
