import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BudgetSelectionComponent } from './budget-selection/budget-selection.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewTransactionsComponent } from './dashboard/view-transactions/view-transactions.component';
import { ViewBudgetComponent } from './dashboard/view-budget/view-budget.component';

import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { PremiumGuard } from '@shared/guards/premium/premium.guard';
import { BudgetGuard } from '@shared/guards/budget/budget.guard';
import { BudgetAccountGuard } from '@shared/guards/budget-account/budget-account.guard';

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
