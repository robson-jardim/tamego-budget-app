import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { BudgetAccountId } from '@models/budget-account.model';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { TransactionId } from '@models/transaction.model';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Subscription } from 'rxjs/Subscription';
import { DashboardViewService } from '@shared/services/dashboard-views/dashboard-views.service';

@Component({
    selector: 'app-budget',
    templateUrl: './view-transactions.component.html',
    styleUrls: ['./view-transactions.component.scss']
})
export class ViewTransactionsComponent implements OnInit, OnDestroy {

    public transactions$;
    private routeParamsSubscription: Subscription;

    constructor(private route: ActivatedRoute,
                private firestore: FirestoreService,
                private dashboardViews: DashboardViewService,
                private dialogService: CloseDialogService,
                private utility: UtilityService) {
    }

    ngOnInit() {

        const routeData$ = this.utility.combineLatestObj({
            budgetId: this.getBudgetId(),
            accountId: this.getAccountId()
        });


        this.routeParamsSubscription = routeData$.subscribe(() => {

            this.transactions$ = routeData$.flatMap(({budgetId, accountId}) => {

                this.firestore.getReoccurringTransactions(budgetId, accountId).observable.subscribe(x => console.log(x));

                const budgetId$: Observable<string> = Observable.of(budgetId);
                const accountIds$: Observable<string[]> = accountId ? Observable.of([accountId]) : this.getAllAccountIdsForBudget(budgetId);

                return this.utility.combineLatestObj({
                    budgetId: budgetId$,
                    accountIds: accountIds$
                });

            }).flatMap(({budgetId, accountIds}) => {

                return this.dashboardViews.getTransactionView(budgetId, accountIds);
            });

        });

    }

    ngOnDestroy() {
        this.routeParamsSubscription.unsubscribe();
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
        }).first().subscribe(response => {
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
