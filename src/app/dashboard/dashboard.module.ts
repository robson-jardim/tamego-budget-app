import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { DashboardComponent } from './dashboard.component';
import { ViewTransactionsModule } from 'app/dashboard/view-transactions/view-transactions.module';
import { SidenavModule } from './sidenav/sidenav.module';
import { ViewBudgetModule } from './view-budget/view-budget.module';
import { RouterModule, Routes } from '@angular/router';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { MatListModule, MatToolbarModule } from '@angular/material';
import { DashboardViewService } from '@shared/services/dashboard-views/dashboard-views.service';
import { ViewBudgetComponent } from './view-budget/view-budget.component';
import { BudgetAccountGuard } from '@shared/guards/budget-account/budget-account.guard';
import { ViewTransactionsComponent } from './view-transactions/view-transactions.component';
import { BudgetGuard } from '@shared/guards/budget/budget.guard';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { PremiumGuard } from '@shared/guards/premium/premium.guard';

const routes: Routes = [
    {
        path: '',
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
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        AppHeaderModule,
        SidenavModule,
        ViewBudgetModule,
        ViewTransactionsModule,

        StandardMaterialModule,
        MatToolbarModule,
        MatListModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        DashboardViewService
    ],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule {
}
