import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore/firestore.service';
import 'rxjs/add/operator/skip';
import { CategoryId } from '../../../../models/category.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { EditCategoryDialogComponent } from '../dialogs/category-dialog/category-dialog.component';
import { CategoryGroupDialogComponent } from '../dialogs/category-group-dialog/category-group-dialog.component';
import { CategoryGroup, CategoryGroupId } from '../../../../models/category-group.model';
import { TransferCategoryDialogComponent } from '../dialogs/transfer-category-dialog/transfer-category-dialog.component';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import 'rxjs/add/operator/do';
import { CategoryValue, CategoryValueId } from '../../../../models/category-value.model';

@Component({
    selector: 'app-budget',
    templateUrl: './view-budget.component.html',
    styleUrls: ['./view-budget.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ViewBudgetComponent implements OnInit {

    public categoryForm: FormGroup;
    public groupForm: FormGroup;

    public categoryColumns = ['categoryName', 'budgeted', 'budgetedTotal', 'offset', 'offsetTotal', 'activity', 'exists', 'actions'];
    public budget;

    private budgetViewMonth: Date;
    public dataSources: CategoryDataSource[];

    selectedRowIndex = -1;

    constructor(private firestore: FirestoreService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private dialog: MatDialog) {
    }

    ngOnInit() {
        this.setDate();

        this.getBudgetId().subscribe(budgetId => {
            this.budget = this.firestore.getBudgetView(budgetId).do(data => {
                // TODO - Bottleneck in building data sources
                this.buildDataSources(data);
            });
        });

        this.buildCategoryGroupForm();
        this.buildCategoryForm();
    }

    public buildDataSources(data) {

        this.dataSources = data.groups.map(group => {

            const formattedTableData = group.categories.map(category => {

                const isOnOrBeforeViewMonth = (value) => {
                    return value.budgetMonth <= this.budgetViewMonth;
                };

                const isOnViewMonth = (value) => {
                    // Does equality check on dates to make sure they are equal
                    return value.budgetMonth <= this.budgetViewMonth && value.budgetMonth >= this.budgetViewMonth;
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
                        budgetMonth: this.budgetViewMonth,
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

    public highlight(row) {
        this.selectedRowIndex = row.categoryId;
    }

    public unhighlight(row) {
        this.selectedRowIndex = -1;
    }

    public trackGroup(index, group: CategoryGroupId) {
        return group ? group.groupId : undefined;
    }

    public trackCategories(index, category: CategoryId) {
        return category ? category.categoryId : undefined;
    }

    private buildCategoryGroupForm() {
        this.groupForm = this.formBuilder.group({
            groupName: ['', Validators.required]
        });
    }

    private buildCategoryForm() {
        this.categoryForm = this.formBuilder.group({
            categoryName: ['', Validators.required]
        });
    }

    public createGroupDialog(budget) {

        const nextGroupPosition = budget.groups.length;

        this.dialog.open(CategoryGroupDialogComponent, {
            data: {
                groupCollection: budget.collections.groups,
                nextGroupPosition: nextGroupPosition,
                mode: 'CREATE'
            }
        });
    }

    public updateGroupDialog(budget, group: CategoryGroupId) {
        this.dialog.open(CategoryGroupDialogComponent, {
            data: {
                groupCollection: budget.collections.groups,
                group: group,
                mode: 'UPDATE'
            }
        });
    }

    public updateCategoryDialog(budget, category) {
        this.dialog.open(EditCategoryDialogComponent, {
            data: {
                category: category,
                categoryCollection: budget.collections.categories,
                categoryValueCollection: budget.collections.categoryValues,
                mode: 'UPDATE'
            }
        });
    }

    public createCategoryDialog(budget, group, groupIndex) {

        const nextCategoryPosition = budget.groups[groupIndex].categories.length;

        this.dialog.open(EditCategoryDialogComponent, {
            data: {
                categoryCollection: budget.collections.categories,
                group: group,
                nextCategoryPosition: nextCategoryPosition,
                mode: 'CREATE',
            }
        });
    }

    public transferCategoryDialog(category: CategoryId) {

        this.getBudgetId().subscribe(budgetId => {
            this.dialog.open(TransferCategoryDialogComponent, {
                data: {
                    category: category,
                    budgetId: budgetId
                }
            });

        });
    }

    private setDate() {
        const temp = new Date();
        // getMonth() is user over getUTCMonth() because the following should be based on local time
        const currentMonth = temp.getMonth();
        const currentYear = temp.getFullYear();
        this.budgetViewMonth = new Date(currentYear, currentMonth, 1);
    }

    public get viewMonth() {
        return this.budgetViewMonth.toLocaleString('en-us', {month: 'long'});
    }

    public get viewYear() {
        return this.budgetViewMonth.getFullYear();
    }

    public nextMonth() {
        const currentMonth = this.budgetViewMonth.getMonth();
        this.budgetViewMonth.setMonth(currentMonth + 1);
    }

    public previousMonth() {
        const currentMonth = this.budgetViewMonth.getMonth();
        this.budgetViewMonth.setMonth(currentMonth - 1);
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
