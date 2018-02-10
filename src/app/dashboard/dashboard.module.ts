import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { DashboardComponent } from './dashboard.component';
import { ViewTransactionsModule } from 'app/dashboard/view-transactions/view-transactions.module';
import { SidenavModule } from './sidenav/sidenav.module';
import { ViewBudgetModule } from './view-budget/view-budget.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        AppHeaderModule,
        SidenavModule,
        ViewBudgetModule,
        ViewTransactionsModule
    ],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule {
}
