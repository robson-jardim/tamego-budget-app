import { Component, HostListener, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { environment } from '@environments/environment';
import { AuthService } from '@shared/services/auth/auth.service';
import { HttpRequestService } from '@shared/services/http-request/http-request.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    handler: any;

    constructor(private paymentService: PaymentService, public auth: AuthService) {
    }

    ngOnInit() {
        this.handler = StripeCheckout.configure({
            key: environment.stripe.public_key,
            token: token => {
                this.paymentService.addPaymentMethod(token);
            }
        });
    }

    public handlePayment() {

        this.auth.user.first().subscribe(user => {
            this.handler.open({
                name: 'Tamego',
                description: 'Premium',
                email: user.email
            });
        });
    }

    @HostListener('window:popstate')
    onPopstate() {
        this.handler.close();
    }
}
