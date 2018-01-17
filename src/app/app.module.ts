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

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatSnackBarModule,

        AppCoreModule,
        AppGuardsModule,
        OfflineClientModule,

        // Routing priority is based on import order
        LoginSignupModule,
        BudgetSelectionModule,
        DashboardModule,
        SettingsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
