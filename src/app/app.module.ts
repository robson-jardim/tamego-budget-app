import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppCoreModule } from '@shared/services/app-core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardModule } from 'app/dashboard/dashboard.module';
import { BudgetSelectionModule } from './budget-selection/budget-selection.module';
import { LoginSignupModule } from './login-signup/login-signup.module';

// Move into modules
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '@shared/app-material.module';
import { AppGuardsModule } from '@shared/guards/app-guards.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OfflineDialogComponent } from '@shared/components/offline-dialog/offline-dialog.component';
import { TokenInterceptor } from '@shared/interceptors/token.interceptor';
import { HttpRequestService } from '@shared/services/http-request/http-request.service';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { DateConverterService } from '@shared/services/date-converter/date-converter.service';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,

        HttpClientModule,
        ReactiveFormsModule,

        AppMaterialModule,
        AppCoreModule,
        AppGuardsModule,

        LoginSignupModule,
        BudgetSelectionModule,
        DashboardModule,
        SettingsModule,

        AppRoutingModule, // Put last so other modules routing is a priority
    ],
    declarations: [
        AppComponent,

        OfflineDialogComponent,
    ],
    entryComponents: [
        OfflineDialogComponent,
    ],
    providers: [
        HttpRequestService,
        CloseDialogService,
        DateConverterService,
        GeneralNotificationsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
