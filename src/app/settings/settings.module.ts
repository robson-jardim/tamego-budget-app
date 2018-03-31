import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { SettingsComponent } from './settings.component';
import { BillingModule } from './billing/billing.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { AppPipesModule } from '@shared/pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { MatTooltipModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        AppHeaderModule,
        StandardMaterialModule,
        BillingModule,
        CustomMaterialFormsModule,
        AppPipesModule,
        MatTooltipModule
    ],
    declarations: [
        SettingsComponent
    ]
})
export class SettingsModule {
}
