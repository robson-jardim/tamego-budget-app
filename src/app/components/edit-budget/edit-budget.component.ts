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
    templateUrl: './edit-budget.component.html',
    styleUrls: ['./edit-budget.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditBudgetComponent implements OnInit {

    public categoryForm: FormGroup;
    public groupForm: FormGroup;

    public categoryColumns = ['categoryName', 'categoryId', 'groupId', 'actions'];
    public budget;

    private viewDate: Date;
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

            this.budget = this.firestore.getEditBudget(budgetId).do(data => {
                this.buildDataSources(data);
            });
        });

        this.buildCategoryGroupForm();
        this.buildCategoryForm();
    }

    public buildDataSources(data) {

        this.dataSources = data.groups.map(group => {

            const formattedGroup = group.categories.map(category => {

                const isOnOrBeforeViewDate = (value: CategoryValueId) => {
                    return value.time <= this.viewDate;
                };

                const sum = (prev, next) => {
                    return prev + next;
                };

                const budgted = (value: CategoryValueId) => {
                    return value.budgeted;
                };

                const offset = (value: CategoryValueId) => {
                    return value.offset;
                };

                const offsetTotal = category.values.filter(isOnOrBeforeViewDate).map(offset).reduce(sum, 0);
                const budgetedTotal = category.values.filter(isOnOrBeforeViewDate).map(budgted).reduce(sum, 0);
                const docExists = category.values.map(value => value.time.toISOString()).includes(this.viewDate.toISOString());

                return {
                    ...category,
                    offsetTotal,
                    budgetedTotal,
                    docExists
                };
            });

            return new CategoryDataSource(formattedGroup);
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

    public updateCategoryDialog(budget, category: CategoryId) {
        this.dialog.open(EditCategoryDialogComponent, {
            data: {
                category: category,
                categoryCollection: budget.collections.categories,
                mode: 'UPDATE'
            }
        });
    }

    public createCategoryDialog(budget, group: CategoryGroupId, groupIndex) {

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
        this.viewDate = new Date(currentYear, currentMonth, 1);
    }

    public get viewMonth() {
        return this.viewDate.toLocaleString('en-us', {month: 'long'});
    }

    public get viewYear() {
        return this.viewDate.getFullYear();
    }

    public nextMonth() {
        const currentMonth = this.viewDate.getMonth();
        this.viewDate.setMonth(currentMonth + 1);
    }

    public previousMonth() {
        const currentMonth = this.viewDate.getMonth();
        this.viewDate.setMonth(currentMonth - 1);
    }

}

export class CategoryDataSource extends DataSource<any> {

    private categories: CategoryId[];

    constructor(categories: CategoryId[]) {
        super();
        this.categories = categories;
    }

    connect(): Observable<CategoryId[]> {
        return Observable.of(this.categories);
    }

    disconnect() {
    }
}
