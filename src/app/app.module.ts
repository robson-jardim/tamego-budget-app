import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppCoreModule } from '@shared/services/app-core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardModule } from 'app/dashboard/dashboard.module';
import { BudgetSelectionModule } from './budget-selection/budget-selection.module';
import { LoginSignupModule } from './login-signup/login-signup.module';
import { AppGuardsModule } from '@shared/guards/app-guards.module';
import { OfflineClientModule } from '@shared/components/offline-dialog/offline-client.module';
import { MatSnackBarModule } from '@angular/material';

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
