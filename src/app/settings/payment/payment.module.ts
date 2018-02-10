import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentService } from './payment.service';
import { FormsModule } from '@angular/forms';
import { StandardMaterialModule } from '@shared/components/standard-material.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StandardMaterialModule
    ],
    declarations: [
        CheckoutComponent
    ],
    providers: [
        PaymentService
    ],
    exports: [
        CheckoutComponent
    ]
})
export class PaymentModule {
}
