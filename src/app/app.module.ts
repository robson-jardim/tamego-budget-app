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
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BudgetComponent } from './components/budget/budget.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginSignupComponent,
        DashboardComponent,
        ToolbarComponent,
        BudgetComponent,
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
