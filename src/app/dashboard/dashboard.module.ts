import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '@shared/components/header/header.module';
import { DashboardComponent } from './dashboard.component';
import { ViewTransactionsModule } from 'app/dashboard/view-transactions/view-transactions.module';
import { SidenavModule } from './sidenav/sidenav.module';
import { ViewBudgetModule } from './view-budget/view-budget.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HeaderModule,
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
