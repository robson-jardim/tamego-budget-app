import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { DashboardComponent } from './dashboard.component';
import { ViewTransactionsModule } from 'app/dashboard/view-transactions/view-transactions.module';
import { SidenavModule } from './sidenav/sidenav.module';
import { ViewBudgetModule } from './view-budget/view-budget.module';
import { RouterModule } from '@angular/router';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { MatListModule, MatToolbarModule } from '@angular/material';
import { DashboardViewService } from '@shared/services/dashboard-views/dashboard-views.service';

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
        MatListModule
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
