import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { OfflineClientModule } from '@shared/components/offline-dialog/offline-client.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppCoreModule } from '@shared/services/app-core.module';
import { AppGuardsModule } from '@shared/guards/app-guards.module';

import { LoginSignupModule } from './login-signup/login-signup.module';
import { BudgetSelectionModule } from './budget-selection/budget-selection.module';
import { DashboardModule } from 'app/dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';
import { UpdateAvailableDialogComponent } from './update-available-dialog/update-available-dialog.component';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { DemoComponent } from './demo/demo.component';
import { LinkAnonymousAccountDialogComponent } from '../shared/components/header/link-anonymous-account-dialog/link-anonymous-account-dialog.component';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        StandardMaterialModule,
        MatSnackBarModule,

        AppCoreModule,
        AppGuardsModule,
        OfflineClientModule,

        SettingsModule,
        BudgetSelectionModule,
        DashboardModule,
        LoginSignupModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        UpdateAvailableDialogComponent,
        DemoComponent,
        LinkAnonymousAccountDialogComponent
    ],
    entryComponents: [
        UpdateAvailableDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
