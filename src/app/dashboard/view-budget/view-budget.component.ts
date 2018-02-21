import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CategoryGroupDialogComponent } from './category-group-dialog/category-group-dialog.component';
import { CategoryGroupId } from '@models/category-group.model';
import { DashboardViewService } from '@shared/services/dashboard-views/dashboard-views.service';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { GroupWithCategoriesWithValues } from '@models/view-budget.model';

@Component({
    selector: 'app-budget',
    templateUrl: './view-budget.component.html',
    styleUrls: ['./view-budget.component.scss'],
})
export class ViewBudgetComponent implements OnInit {

    public groups$: Observable<GroupWithCategoriesWithValues[]>;
    public onChanges$: Observable<any>;

    public viewMonth: Date;

    constructor(private route: ActivatedRoute,
                private dashboardViews: DashboardViewService,
                private dialogService: CloseDialogService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.setViewMonthToLocalMonth();

        this.groups$ = this.getBudgetId().flatMap(budgetId => {
            return this.dashboardViews.getBudgetView(budgetId);
        });

        this.onChanges$ = this.groups$.map(x => {
            return null;
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

    public createGroupDialog(budget) {
        const nextGroupPosition = budget.groups.length;
        this.dialogService.openCreate(CategoryGroupDialogComponent, {
            groupCollection: budget.collections.groups,
            nextGroupPosition: nextGroupPosition
        });
    }

    public updateGroupDialog(budget, group: CategoryGroupId) {
        this.dialogService.openUpdate(CategoryGroupDialogComponent, {
            data: {
                groupCollection: budget.collections.groups,
                group: group,
            }
        });
    }

    public createCategoryDialog(budget, group, groupIndex) {
        const nextCategoryPosition = budget.groups[groupIndex].categories.length;
        this.dialogService.openCreate(CategoryDialogComponent, {
            data: {
                categoryCollection: budget.collections.categories,
                group: group,
                nextCategoryPosition: nextCategoryPosition,
            }
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

}
