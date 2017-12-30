import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from './modules/app-firebase.module';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './modules/app-material.module';
import { AuthGuard } from '../shared/guards/auth/auth.guard';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SignedOutGuard } from '../shared/guards/signed-in/signed-in.guard';
import { OfflineDialogComponent } from '../shared/components/offline-dialog/offline-dialog.component';
import { TokenInterceptor } from '../shared/token.interceptor';
import { UtcPipe } from '../shared/pipes/utc/utc.pipe';
import { RequestService } from '../shared/services/request/request.service';
import { CloseDialogService } from '../shared/services/dialog/dialog.service';
import { DateConverterService } from '../shared/services/dialog/date.service';
import { FirestoreReferenceService } from '../shared/services/firestore-reference/firestore-reference.service';
import { MapFirestoreDocumentIdService } from '../shared/services/map-firestore-document-id/map-firestore-docoument-id.service';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { GeneralNotificationsService } from '../shared/services/general-notifications/general-notifications.service';
import { LoginSignupComponent } from './login-signup/login-signup.component';
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

@NgModule({
    declarations: [
        AppComponent,
        LoginSignupComponent,
        BudgetSelectionComponent,
        ToolbarComponent,
        ViewTransactionsComponent,
        ViewBudgetComponent,
        SidenavComponent,
        AddBudgetDialogComponent,
        AddAccountToBudgetDialogComponent,
        DashboardComponent,
        EditCategoryDialogComponent,
        CategoryGroupDialogComponent,
        TransferCategoryDialogComponent,
        OfflineDialogComponent,
        SettingsComponent,
        TransactionDialogComponent,
        UtcPipe,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppMaterialModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),
        AppFirebaseModule,

        RouterModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        AddBudgetDialogComponent,
        AddAccountToBudgetDialogComponent,
        EditCategoryDialogComponent,
        CategoryGroupDialogComponent,
        TransferCategoryDialogComponent,
        OfflineDialogComponent,
        TransactionDialogComponent
    ],
    providers: [
        AuthGuard,
        SignedOutGuard,
        RequestService,
        CloseDialogService,
        DateConverterService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        FirestoreReferenceService,
        MapFirestoreDocumentIdService,
        FirestoreService,
        GeneralNotificationsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
