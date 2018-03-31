import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './billing.component';
import { PaymentService } from './payment/payment.service';
import { FormsModule } from '@angular/forms';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { HandlePaymentButtonComponent } from './handle-payment-button/handle-payment-button.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StandardMaterialModule
    ],
    declarations: [
        BillingComponent,
        HandlePaymentButtonComponent
    ],
    providers: [
        PaymentService
    ],
    exports: [
        BillingComponent,
        HandlePaymentButtonComponent
    ]
})
export class BillingModule {
}
