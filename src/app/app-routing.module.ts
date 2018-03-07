import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
        component: BudgetSelectionComponent,
        canActivate: [AuthGuard, PremiumGuard]
    },
    {
        path: 'budgets/:budgetId',
        component: DashboardComponent,
        canActivate: [AuthGuard, PremiumGuard, BudgetGuard],
        children: [
            {
                path: '',
                redirectTo: 'budget',
                pathMatch: 'full'
            },
            {
                path: 'budget',
                component: ViewBudgetComponent,
            },
            {
                path: 'accounts',
                component: ViewTransactionsComponent,
            },
            {
                path: 'accounts/:accountId',
                component: ViewTransactionsComponent,
                canActivate: [BudgetAccountGuard]
            }
        ]
    },
    {
        path: '',
        component: AuthenticateComponent,
        canActivate: [SignedOutGuard],
        children: [
            {
                path: 'signin',
                component: SigninComponent
            },
            {
                path: 'signup',
                component: SignupComponent
            },
            {
                path: 'password_reset',
                component: PasswordResetComponent
            },
            {
                path: '**',
                redirectTo: 'signin', // Redirects to sign in page
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'signin', // Redirects to sign in page
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
