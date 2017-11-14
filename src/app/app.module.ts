import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppFirebaseModule } from './modules/app-firebase.module';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';

import { AppComponent } from './components/app/app.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from "./modules/app-material.module";
import { AuthGuard } from "./services/auth-guard/auth.guard";
import { BudgetSelectionComponent } from './components/budget-selection/budget-selection.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AccountsComponent } from "./components/accounts/accounts.component";
import { BudgetComponent } from './components/budget/budget.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginSignupComponent,
        BudgetSelectionComponent,
        ToolbarComponent,
        AccountsComponent,
        BudgetComponent,
        SidenavComponent,
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
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
