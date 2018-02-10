import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { SettingsComponent } from './settings.component';
import { PaymentModule } from './payment/payment.module';
import { MatInputModule } from '@angular/material';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';

@NgModule({
    imports: [
        CommonModule,
        AppHeaderModule,
        StandardMaterialModule,
        PaymentModule,
        CustomMaterialFormsModule
    ],
    declarations: [
        SettingsComponent
    ]
})
export class SettingsModule {
}
