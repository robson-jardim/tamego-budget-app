import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { SignedOutGuard } from '@shared/guards/signed-in/signed-in.guard';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { BudgetSelectionComponent } from './budget-selection/budget-selection.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewBudgetComponent } from './dashboard/view-budget/view-budget.component';
import { ViewTransactionsComponent } from './dashboard/view-transactions/view-transactions.component';
import { SettingsComponent } from './settings/settings.component';

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
