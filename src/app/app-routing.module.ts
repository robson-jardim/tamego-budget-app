import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { ViewTransactionsComponent } from './dashboard/view-transactions/view-transactions.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { ViewBudgetComponent } from './dashboard/view-budget/view-budget.component';
import { BudgetGuard } from '@shared/guards/budget/budget.guard';
import { BudgetAccountGuard } from '@shared/guards/budget-account/budget-account.guard';
import { SettingsComponent } from './settings/settings.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { SignedOutGuard } from '@shared/guards/signed-in/signed-in.guard';
import { BudgetSelectionComponent } from './budget-selection/budget-selection.component';
import { PremiumGuard } from '@shared/guards/premium/premium.guard';

const routes: Routes = [
    {
        path: 'demo',
        component: DemoComponent
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
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
        component: LoginSignupComponent,
        canActivate: [SignedOutGuard]
    },
    {
        path: '**',
        redirectTo: '', // Redirects to login page
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
