import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from './modules/app-firebase.module';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AppComponent } from './components/app/app.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './modules/app-material.module';
import { AuthGuard } from './guards/auth/auth.guard';
import { BudgetSelectionComponent } from './components/budget-selection/budget-selection.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AddBudgetDialogComponent } from './components/dialogs/add-budget-dialog/add-budget-dialog.component';
import { AddAccountToBudgetDialogComponent } from './components/dialogs/add-account-to-budget-dialog/add-account-to-budget-dialog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FirestoreReferenceService } from './services/firestore-reference/firestore-reference.service';
import { FirestoreService } from './services/firestore/firestore.service';
import { MapFirestoreDocumentIdService } from './services/map-firestore-document-id/map-firestore-docoument-id.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EditCategoryDialogComponent } from './components/dialogs/category-dialog/category-dialog.component';
import { GeneralNotificationsService } from './services/general-notifications/general-notifications.service';
import { CategoryGroupDialogComponent } from './components/dialogs/category-group-dialog/category-group-dialog.component';
import { TransferCategoryDialogComponent } from './components/dialogs/transfer-category-dialog/transfer-category-dialog.component';
import { SignedOutGuard } from './guards/signed-in/signed-in.guard';
import { AuthComponent } from './components/auth/auth.component';
import { RequestService } from './services/request/request.service';
import { OfflineDialogComponent } from './offline-dialog/offline-dialog.component';
import { TokenInterceptor } from './token.interceptor';
import { SettingsComponent } from './components/settings/settings.component';
import { ViewTransactionsComponent } from "./components/view-transactions/view-transactions.component";
import { ViewBudgetComponent } from "./components/view-budget/view-budget.component";

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
        AuthComponent,
        OfflineDialogComponent,
        SettingsComponent,
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
        OfflineDialogComponent
    ],
    providers: [
        AuthGuard,
        SignedOutGuard,
        RequestService,
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
