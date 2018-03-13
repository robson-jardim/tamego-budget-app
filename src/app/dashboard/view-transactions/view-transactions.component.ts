import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { ReoccurringTransactionId, TransactionId } from '@models/transaction.model';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Subscription } from 'rxjs/Subscription';
import { DashboardViewService } from '@shared/services/dashboard-views/dashboard-views.service';
import 'rxjs/add/observable/timer';
import { ReoccurringTransferId, TransferId } from '@models/transfer.model';

@Component({
    selector: 'app-budget',
    templateUrl: './view-transactions.component.html',
    styleUrls: ['./view-transactions.component.scss']
})
export class ViewTransactionsComponent implements OnInit, OnDestroy {

    private routeParamsSubscription: Subscription;
    public transactions$: Observable<Array<TransactionId | TransferId | ReoccurringTransactionId | ReoccurringTransferId>>;
    public onTransactionEntitiesChange$;
    public isSingleAccountView: boolean;

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

                if (accountId) {
                    this.isSingleAccountView = true;
                }
                else {
                    this.isSingleAccountView = false;
                }

                const budgetId$: Observable<string> = Observable.of(budgetId);
                const accountIds$: Observable<string[]> = accountId ? Observable.of([accountId]) : this.firestore.getAllAccountIdsForBudget(budgetId);

                return this.utility.combineLatestObj({
                    budgetId: budgetId$,
                    accountIds: accountIds$
                });

            }).flatMap(({budgetId, accountIds}) => {
                return this.dashboardViews.getTransactionView(budgetId, accountIds);
            });
        });

        const viewData$ = this.utility.combineLatestObj({
            accounts: this.getAccounts(),
            payees: this.getPayees(),
            groups: this.getGroups()
        });

        this.onTransactionEntitiesChange$ = this.utility.combineLatestObj({
            viewData: viewData$,
            transactions: this.transactions$,
            budgetId: this.getBudgetId()
        });
    }

    ngOnDestroy() {
        this.routeParamsSubscription.unsubscribe();
    }

    private getAccountId(): Observable<string> {
        return this.route.params.map(params => {
            return params.accountId;
        });
    }

    public getBudgetId(): Observable<string> {
        return this.route.parent.params.map(params => {
            return params.budgetId;
        });
    }

    public createTransaction() {

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

    private getAccounts() {
        return this.getBudgetId().flatMap(budgetId => {
            return this.firestore.getAccounts(budgetId).observable;
        });
    }

    private getPayees() {
        return this.getBudgetId().flatMap(budgetId => {
            return this.firestore.getPayees(budgetId).observable;
        });
    }

    private getGroups() {
        return this.getBudgetId().flatMap(budgetId => {
            return this.firestore.getGroupWithCategories(budgetId).observable;
        });
    }
}
