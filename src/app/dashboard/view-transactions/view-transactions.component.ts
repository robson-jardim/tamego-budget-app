import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { BudgetAccountId } from '../../../../models/budget-account.model';
import { CloseDialogService } from '../../../shared/services/close-dialog/close-dialog.service';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { TransactionId } from '../../../../models/transaction.model';

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
                private dialogService: CloseDialogService) {
    }

    ngOnInit() {

        Observable.combineLatest(this.getBudgetId(), this.getAccountId()).subscribe(([budgetId, accountId]) => {

            if (accountId) {
                const accountIds = [accountId];
                this.transactions = this.firestore.getTransactionView(budgetId, accountIds);
            }
            else {
                this.firestore.getAccounts(budgetId).observable.take(1).subscribe((accounts: BudgetAccountId[]) => {
                    const accountIds = accounts.map(a => a.budgetAccountId);
                    this.transactions = this.firestore.getTransactionView(budgetId, accountIds);
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
        Observable.combineLatest(this.getBudgetId(), this.getAccountId())
            .take(1)
            .subscribe(([budgetId, accountId]) => {

                const data: any = {budgetId};
                if (accountId) {
                    data.accountId = accountId;
                }

                this.dialogService.openCreate(TransactionDialogComponent, {data});
            });
    }

    public updateTransaction(transaction: TransactionId) {
        Observable.combineLatest(this.getBudgetId(), this.getAccountId())
            .take(1)
            .subscribe(([budgetId, accountId]) => {
                this.dialogService.openUpdate(TransactionDialogComponent, {
                    data: {
                        budgetId,
                        accountId,
                        ...transaction
                    }
                });
            });
    }
}
