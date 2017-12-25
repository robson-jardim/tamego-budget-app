import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { BudgetSelectionComponent } from './components/budget-selection/budget-selection.component';

import { ViewBudgetComponent } from './components/view-budget/view-budget.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignedOutGuard } from './guards/signed-in/signed-in.guard';
import { AuthComponent } from './components/auth/auth.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ViewTransactionsComponent } from './components/view-transactions/view-transactions.component';

const routes: Routes = [
    {
        path: '',
        component: LoginSignupComponent,
        canActivate: [SignedOutGuard]
    },
    {
        path: 'budgets',
        component: BudgetSelectionComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'budgets/:budgetId',
        component: DashboardComponent,
        canActivate: [AuthGuard],
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
                component: ViewTransactionsComponent
            }
        ]
    },
    {
        path: 'auth',
        component: AuthComponent
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]

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
