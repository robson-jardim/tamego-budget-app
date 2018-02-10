import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '@shared/components/header/header.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { SettingsComponent } from './settings.component';
import { CheckoutComponent } from './payment/checkout/checkout.component';
import { PaymentModule } from './payment/payment.module';

@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        StandardMaterialModule,
        PaymentModule
    ],
    declarations: [
        SettingsComponent
    ]
})
export class SettingsModule {
}
