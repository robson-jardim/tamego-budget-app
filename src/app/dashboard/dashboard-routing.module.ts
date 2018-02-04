import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewBudgetComponent } from './view-budget/view-budget.component';
import { ViewTransactionsComponent } from './view-transactions/view-transactions.component';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { BudgetGuard } from '@shared/guards/budget/budget.guard';
import { BudgetAccountGuard } from '@shared/guards/budget-account/budget-account.guard';


// TODO - create route guards for budgets and accounts

const routes: Routes = [
    {
        path: 'budgets/:budgetId',
        component: DashboardComponent,
        canActivate: [AuthGuard, BudgetGuard],
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {
}
