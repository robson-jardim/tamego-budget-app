import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/skip';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { EditCategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CategoryGroupDialogComponent } from './category-group-dialog/category-group-dialog.component';
import 'rxjs/add/operator/do';
import { CategoryGroupId } from '@models/category-group.model';
import { CategoryId } from '@models/category.model';
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
    public viewMonth: Date;
    public dataSources: CategoryDataSource[];

    constructor(private route: ActivatedRoute,
                private dialog: MatDialog,
                private dashboardViews: DashboardViewService,
                private dialogService: CloseDialogService) {
    }

    ngOnInit() {
        this.setLocalViewMonth();

        this.groups$ = this.getBudgetId().flatMap(budgetId => {
            return this.dashboardViews.getBudgetView(budgetId);
        });
    }

    public buildDataSources(data) {

        this.dataSources = data.groups.map(group => {

            const formattedTableData = group.categories.map(category => {

                const isOnOrBeforeViewMonth = (value) => {
                    return value.budgetMonth <= this.viewMonth;
                };

                const isOnViewMonth = (value) => {
                    // Does equality check on dates to make sure they are equal
                    return value.budgetMonth <= this.viewMonth && value.budgetMonth >= this.viewMonth;
                };

                const sum = (prev, next) => {
                    return prev + next;
                };

                const budgted = (value) => {
                    return value.budgeted;
                };

                const offset = (value) => {
                    return value.offset;
                };

                const first = (element) => {
                    return !!element;
                };

                const offsetTotal = category.values.filter(isOnOrBeforeViewMonth).map(offset).reduce(sum, 0);
                const budgetedTotal = category.values.filter(isOnOrBeforeViewMonth).map(budgted).reduce(sum, 0);
                let [desiredValue] = category.values.filter(isOnViewMonth);

                if (!desiredValue) {
                    desiredValue = {
                        categoryId: category.categoryId,
                        budgeted: 0,
                        offset: 0,
                        budgetMonth: this.viewMonth,
                        exists: false
                    };
                }
                else {
                    desiredValue.exists = true;
                }

                return {
                    offsetTotal,
                    budgetedTotal,
                    desiredValue: {
                        ...desiredValue,
                    },
                    ...category
                };
            });

            return new CategoryDataSource(formattedTableData);
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
        this.dialogService.openCreate(EditCategoryDialogComponent, {
            data: {
                categoryCollection: budget.collections.categories,
                group: group,
                nextCategoryPosition: nextCategoryPosition,
            }
        });
    }

    private setLocalViewMonth() {
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

}

export class CategoryDataSource extends DataSource<any> {

    private data;

    constructor(data) {
        super();
        this.data = data;
    }

    connect(): Observable<any[]> {
        return Observable.of(this.data);
    }

    disconnect() {
    }
}
