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

    public transactions$;

    constructor(private route: ActivatedRoute,
                private firestore: FirestoreService,
                private dialogService: CloseDialogService,
                private utility: UtilityService) {
    }

    ngOnInit() {

        this.transactions$ = this.utility.combineLatestObj({
            budgetId: this.getBudgetId(),
            accountId: this.getAccountId()
        }).flatMap(({budgetId, accountId}) => {
            if (accountId) {
                return Observable.of([accountId]);
            }
            else {
                return this.getAllAccountIdsForBudget(budgetId);
            }
        }).flatMap(accountIds => {
            return this.firestore.getTransactionView('aqvJ4oQo0E5ldQRdsxsR', accountIds);
        });

        this.transactions$.subscribe(x => console.log(x));


        // this.transactions$ = this.firestore.getTransactionView(budgetId, accountIds).map(x => x.data);


        // Observable.combineLatest(this.getBudgetId(), this.getAccountId()).subscribe(([budgetId, accountId]) => {
        //
        //     if (accountId) {
        //         const accountIds = [accountId];
        //         this.transactions = this.firestore.getTransactionView(budgetId, accountIds);
        //     }
        //     else {
        //         this.firestore.getAccounts(budgetId).observable.take(1).subscribe((accounts: BudgetAccountId[]) => {
        //             const accountIds = accounts.map(a => a.budgetAccountId);
        //             this.transactions = this.firestore.getTransactionView(budgetId, accountIds);
        //         });
        //     }
        // });
    }

    private getAllAccountIdsForBudget(budgetId: string) {
        return this.firestore.getAccounts(budgetId).observable.first()
            .map((accounts: BudgetAccountId[]) => {
                return accounts.map(x => x.budgetAccountId);
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
            const data = {
                budgetId,
                accountId
            };

            this.dialogService.openCreate(TransactionDialogComponent, {data});
        });
    }

    public updateTransaction(transaction: TransactionId) {
        this.getBudgetId().subscribe(budgetId => {
            this.dialogService.openUpdate(TransactionDialogComponent, {
                data: {
                    budgetId,
                    ...transaction
                }
            });
        });
    }
}
