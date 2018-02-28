import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CategoryGroupDialogComponent } from './category-group-dialog/category-group-dialog.component';
import { CategoryGroupId } from '@models/category-group.model';
import { DashboardViewService } from '@shared/services/dashboard-views/dashboard-views.service';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { GroupWithCategoriesWithValues } from '@models/view-budget.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { ReoccurringTransferId, TransferId } from '@models/transfer.model';
import { ReoccurringTransactionId, TransactionId } from '@models/transaction.model';
import { UtilityService } from '@shared/services/utility/utility.service';

@Component({
    selector: 'app-budget',
    templateUrl: './view-budget.component.html',
    styleUrls: ['./view-budget.component.scss'],
})
export class ViewBudgetComponent implements OnInit {

    public data$: Observable<Object>;
    public onChanges$: Observable<any>;
    public viewMonth: Date;

    constructor(private route: ActivatedRoute,
                private dashboardViews: DashboardViewService,
                private dialogService: CloseDialogService,
                private firestore: FirestoreService,
                private utility: UtilityService) {
    }

    ngOnInit() {
        this.setViewMonthToLocalMonth();

        // Change detection does not traverse nested objects like array. This is required to allow for updates to
        // category values to update in the UI
        this.onChanges$ = this.getBudgetGroups().map(() => {
            return null;
        });

        this.data$ = this.utility.combineLatestObj({
            groups: this.getBudgetGroups(),
            budgetId: this.getBudgetId(),
            transactions: this.getTransactions()
        });
    }

    public getBudgetGroups(): Observable<GroupWithCategoriesWithValues[]> {
        return this.getBudgetId().flatMap(budgetId => {
            return this.dashboardViews.getBudgetView(budgetId);
        });
    }

    public getBudgetId(): Observable<string> {
        return this.route.parent.params.map(params => {
            return params.budgetId;
        });
    }

    public trackGroup(index, group: CategoryGroupId) {
        return group ? group.groupId : undefined;
    }

    public createCategoryGroup(groups: GroupWithCategoriesWithValues[]) {
        this.getBudgetId().subscribe(budgetId => {
            const nextGroupPosition = groups.length;
            this.dialogService.openCreate(CategoryGroupDialogComponent, {
                data: {
                    budgetId,
                    nextGroupPosition
                }
            });
        });
    }

    public updateCategoryGroup(group: GroupWithCategoriesWithValues) {

        this.getBudgetId().subscribe(budgetId => {
            this.dialogService.openUpdate(CategoryGroupDialogComponent, {
                data: {
                    budgetId,
                    ...group
                }
            });
        });
    }

    private setViewMonthToLocalMonth() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        this.viewMonth = new Date(currentYear, currentMonth, 1);
    }

    public nextMonth() {
        // Date pipes are pure, therefore a copy has to be
        // assigned in order for the viewMonth to update properly in the template
        const dateCopy = new Date(this.viewMonth.getTime());
        dateCopy.setMonth(dateCopy.getMonth() + 1);
        this.viewMonth = dateCopy;
    }

    public previousMonth() {
        // Date pipes are pure, therefore a copy has to be
        // assigned in order for the viewMonth to update properly in the template
        const dateCopy = new Date(this.viewMonth.getTime());
        dateCopy.setMonth(dateCopy.getMonth() - 1);
        this.viewMonth = dateCopy;
    }

    public createCategory(group: GroupWithCategoriesWithValues) {
        const nextCategoryPosition = group.categories.length;

        this.getBudgetId().subscribe(budgetId => {
            this.dialogService.openCreate(CategoryDialogComponent, {
                data: {
                    budgetId,
                    nextCategoryPosition,
                    groupId: group.groupId
                }
            });
        });
    }

    private getTransactions(): Observable<Array<TransactionId | TransferId | ReoccurringTransactionId | ReoccurringTransferId>> {
        let budgetId;

        return this.getBudgetId().flatMap(id => {
            budgetId = id;
            return this.firestore.getAllAccountIdsForBudget(id);
        }).flatMap((accountIds: string[]) => {
            return this.dashboardViews.getTransactionView(budgetId, accountIds);
        });
    }
}
