import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { PaymentService } from '../payment/payment.service';
import { environment } from '@environments/environment';
import 'rxjs/add/operator/first';

@Component({
    selector: 'app-handle-payment-button',
    templateUrl: './handle-payment-button.component.html',
    styleUrls: ['./handle-payment-button.component.scss']
})
export class HandlePaymentButtonComponent implements OnInit {

    @Input() color = '';
    @Input() text = '';
    @Input() disabled = false;

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

            let buttonMessage;
            let amount;

            if(user.cardDetails) {
                buttonMessage = 'Update card';
                amount = null;
            }
            else {
                buttonMessage = 'Subscribe';
                amount = 500;
            }

            this.handler.open({
                name: 'Tamego',
                description: 'Premium',
                amount: amount,
                email: user.email,
                image: environment.appLogo,
                panelLabel: buttonMessage,
                allowRememberMe: false
            });
        });
    }

    @HostListener('window:popstate')
    onPopstate() {
        this.handler.close();
    }
}
