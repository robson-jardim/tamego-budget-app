import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { BudgetAccountId } from '@models/budget-account.model';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { TransactionId } from '@models/transaction.model';
import { UtilityService } from '@shared/services/utility/utility.service';

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
                private dialogService: CloseDialogService,
                private utility: UtilityService) {
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

        this.utility.combineLatestObj({
            budgetId: this.getBudgetId(),
            accountId: this.getAccountId()
        }).subscribe(response => {
            const {budgetId, accountId} = response;
            const data = {budgetId, accountId};

            this.dialogService.openCreate(TransactionDialogComponent, {data});
        });
    }

    public updateTransaction(transaction: TransactionId) {
        Observable.combineLatest(this.getBudgetId(), this.getAccountId())
            .first()
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
