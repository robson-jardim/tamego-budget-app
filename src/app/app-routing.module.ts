import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BudgetSelectionComponent } from './budget-selection/budget-selection.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewTransactionsComponent } from './dashboard/view-transactions/view-transactions.component';
import { ViewBudgetComponent } from './dashboard/view-budget/view-budget.component';

import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { SignedOutGuard } from '@shared/guards/signed-in/signed-in.guard';
import { PremiumGuard } from '@shared/guards/premium/premium.guard';
import { BudgetGuard } from '@shared/guards/budget/budget.guard';
import { BudgetAccountGuard } from '@shared/guards/budget-account/budget-account.guard';
import { SigninComponent } from '@shared/components/signin/signin.component';
import { SignupComponent } from '@shared/components/signup/signup.component';
import { AuthenticateComponent } from './authenticate/authenticate-user.component';
import { PasswordResetComponent } from './authenticate/password-reset/password-reset.component';
import { BudgetSelectionModule } from './budget-selection/budget-selection.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthenticateUserModule } from './authenticate/authenticate-user.module';

const routes: Routes = [
    {
        path: 'demo',
        loadChildren: './demo/demo.module#DemoModule'
    },
    {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
    },
    {
        path: 'budgets',
        loadChildren: './budget-selection/budget-selection.module#BudgetSelectionModule'
    },
    {
        path: 'budgets/:budgetId',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
    },
    {
        path: '',
        loadChildren: './authenticate/authenticate-user.module#AuthenticateUserModule'
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
