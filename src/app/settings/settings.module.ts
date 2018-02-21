import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { SettingsComponent } from './settings.component';
import { PaymentModule } from './payment/payment.module';
import { MatInputModule } from '@angular/material';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { DaysUntilPipe } from '@shared/pipes/days-until/days-until.pipe';
import { AppPipesModule } from '@shared/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        AppHeaderModule,
        StandardMaterialModule,
        PaymentModule,
        CustomMaterialFormsModule,
        AppPipesModule
    ],
    declarations: [
        SettingsComponent,
    ]
})
export class SettingsModule {
}
