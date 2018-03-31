import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { OfflineClientModule } from '@shared/components/offline-dialog/offline-client.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppCoreModule } from '@shared/services/app-core.module';
import { AppGuardsModule } from '@shared/guards/app-guards.module';

import { BudgetSelectionModule } from './budget-selection/budget-selection.module';
import { DashboardModule } from 'app/dashboard/dashboard.module';
import { UpdateAvailableDialogComponent } from './update-available-dialog/update-available-dialog.component';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { LinkAnonymousAccountModule } from '@shared/components/link-anonymous-account-dialog/link-anonymous-account.module';
import { SettingsModule } from './settings/settings.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        StandardMaterialModule,
        MatSnackBarModule,
        CustomMaterialFormsModule,
        AppHeaderModule,
        AppCoreModule,
        AppGuardsModule,
        OfflineClientModule,
        LinkAnonymousAccountModule,

        BudgetSelectionModule,
        DashboardModule,
        SettingsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        UpdateAvailableDialogComponent
    ],
    entryComponents: [
        UpdateAvailableDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
