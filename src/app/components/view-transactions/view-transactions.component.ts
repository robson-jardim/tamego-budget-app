import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FirestoreService } from '../../services/firestore/firestore.service';
import 'rxjs/add/operator/map';
import { BudgetAccountId } from '../../../../models/budget-account.model';
import { DialogService } from '../../services/dialog-service/dialog.service';
import { TransactionDialogComponent } from '../dialogs/transaction-dialog/transaction-dialog.component';

@Component({
    selector: 'app-budget',
    templateUrl: './view-transactions.component.html',
    styleUrls: ['./view-transactions.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ViewTransactionsComponent implements OnInit {

    public transactions;

    constructor(private route: ActivatedRoute,
                private firestore: FirestoreService,
                private dialogService: DialogService) {
    }

    ngOnInit() {

        Observable.combineLatest(this.getBudgetId(), this.getAccountId()).subscribe(([budgetId, accountId]) => {

            if (accountId) {
                const accountIds = [accountId];
                this.transactions = this.firestore.getTransactionView(budgetId, accountIds);

                this.transactions.subscribe(x => {
                    console.log(x);
                });
            }
            else {
                this.firestore.getAccounts(budgetId).observable.take(1).subscribe((accounts: BudgetAccountId[]) => {
                    const accountIds = accounts.map(a => a.budgetAccountId);
                    this.transactions = this.firestore.getTransactionView(budgetId, accountIds);

                    // this.transactions.subscribe(x => {
                    //     console.log(x);
                    // });
                });
            }
        });
    }

    private getAccountId(): Observable<string> {
        return this.route.params.map(params => {
            return params.accountId;
        });
    }

    private getBudgetId(): Observable<string> {
        return this.route.parent.params.map(params => {
            return params.budgetId;
        });
    }

    public createTransactionDialog() {
        this.dialogService.openCreate(TransactionDialogComponent, {
            data: {
                test: 'test message'
            }
        });
    }
}
