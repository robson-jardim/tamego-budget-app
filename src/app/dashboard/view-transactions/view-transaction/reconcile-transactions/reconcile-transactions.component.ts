import { Component, Input, OnInit } from '@angular/core';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { ReconcileConfirmDialogComponent } from '../reconcile-dialog/reconcile-dialog.component';
import { DashboardViewService } from '@shared/services/dashboard-views/dashboard-views.service';

@Component({
    selector: 'app-reconcile-transactions',
    templateUrl: './reconcile-transactions.component.html',
    styleUrls: ['./reconcile-transactions.component.scss']
})
export class ReconcileTransactionsComponent implements OnInit {

    @Input() budgetId;
    @Input() accountId: string;

    constructor(private dialogService: CloseDialogService,
                private dashboardViews: DashboardViewService) {
    }

    ngOnInit() {
    }

    public reconcile() {
        this.dashboardViews.getTransactionView(this.budgetId, [this.accountId])
            .first()
            .subscribe(transactions => {
                this.dialogService.open(ReconcileConfirmDialogComponent, {
                    data: {
                        transactions,
                        budgetId: this.budgetId
                    }
                });
            });
    }

}
