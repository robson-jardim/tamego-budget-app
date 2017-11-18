import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppFirebaseModule } from './modules/app-firebase.module';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';

import { AppComponent } from './components/app/app.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './modules/app-material.module';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { BudgetSelectionComponent } from './components/budget-selection/budget-selection.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { EditBudgetComponent } from './components/edit-budget/edit-budget.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AddBudgetDialogComponent } from './components/add-budget-dialog/add-budget-dialog.component';
import { AddAccountToBudgetDialogComponent } from './components/add-account-to-budget-dialog/add-account-to-budget-dialog.component';
import { DatabaseService } from "./services/database/database.service";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TestingComponent } from './components/testing/testing.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginSignupComponent,
        BudgetSelectionComponent,
        ToolbarComponent,
        AccountsComponent,
        EditBudgetComponent,
        SidenavComponent,
        AddBudgetDialogComponent,
        AddAccountToBudgetDialogComponent,
        DashboardComponent,
        TestingComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppMaterialModule,

        AngularFireModule.initializeApp(environment.firebase),
        AppFirebaseModule,

        RouterModule,
        AppRoutingModule,

        ReactiveFormsModule
    ],
    entryComponents: [
        AddBudgetDialogComponent,
        AddAccountToBudgetDialogComponent
    ],
    providers: [AuthGuard, DatabaseService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
