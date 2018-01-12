import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from './app-firebase.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './app-material.module';
import { AuthGuard } from '../shared/guards/auth/auth.guard';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SignedOutGuard } from '../shared/guards/signed-in/signed-in.guard';
import { OfflineDialogComponent } from '../shared/components/offline-dialog/offline-dialog.component';
import { TokenInterceptor } from '../shared/interceptors/token.interceptor';
import { HttpRequestService } from '../shared/services/http-request/http-request.service';
import { CloseDialogService } from '../shared/services/close-dialog/close-dialog.service';
import { UtilityService } from '../shared/services/date-converter/date-converter.service';
import { GeneralNotificationsService } from '../shared/services/general-notifications/general-notifications.service';
import { BudgetSelectionComponent } from './budget-selection/budget-selection.component';
import { ViewTransactionsComponent } from './dashboard/view-transactions/view-transactions.component';
import { ViewBudgetComponent } from './dashboard/view-budget/view-budget.component';
import { SidenavComponent } from './dashboard/sidenav/sidenav.component';
import { AddBudgetDialogComponent } from './budget-selection/add-budget-dialog/add-budget-dialog.component';
import { AddAccountToBudgetDialogComponent } from './dashboard/sidenav/add-account-to-budget-dialog/add-account-to-budget-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditCategoryDialogComponent } from './dashboard/view-budget/category-dialog/category-dialog.component';
import { CategoryGroupDialogComponent } from './dashboard/view-budget/category-group-dialog/category-group-dialog.component';
import { TransferCategoryDialogComponent } from './dashboard/view-budget/transfer-category-dialog/transfer-category-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { TransactionDialogComponent } from './dashboard/view-transactions/transaction-dialog/transaction-dialog.component';
import { UtcDatePipe } from '../shared/pipes/utc-date/utc-date.pipe';
import { LoginSignupComponent } from './login-signup/login-signup.component';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        HttpClientModule,
        ReactiveFormsModule,

        AppRoutingModule,
        AppFirebaseModule,
        AppMaterialModule,
    ],
    declarations: [
        AppComponent,
        ToolbarComponent,
        OfflineDialogComponent,
        UtcDatePipe,


        LoginSignupComponent,

        BudgetSelectionComponent,
        AddBudgetDialogComponent,

        DashboardComponent,
        SidenavComponent,
        AddAccountToBudgetDialogComponent,
        ViewTransactionsComponent,
        ViewBudgetComponent,
        EditCategoryDialogComponent,
        CategoryGroupDialogComponent,
        TransferCategoryDialogComponent,
        TransactionDialogComponent,

        SettingsComponent
    ],
    entryComponents: [
        AddBudgetDialogComponent,
        AddAccountToBudgetDialogComponent,
        EditCategoryDialogComponent,
        CategoryGroupDialogComponent,
        TransferCategoryDialogComponent,
        OfflineDialogComponent,
        TransactionDialogComponent,
    ],
    providers: [
        AuthGuard,
        SignedOutGuard,

        HttpRequestService,
        CloseDialogService,
        UtilityService,
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
