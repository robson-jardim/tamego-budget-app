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
import { CategoryGroupId } from '../../../../models/category-group.model';
import { TransferCategoryDialogComponent } from '../dialogs/transfer-category-dialog/transfer-category-dialog.component';

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
    public groupsResult;

    selectedRowIndex: number = -1;

    constructor(private firestore: FirestoreService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private dialog: MatDialog) {
    }

    ngOnInit() {


        this.getBudgetId().subscribe(budgetId => {

            this.groupsResult = this.firestore.getGroupsAndCategories(budgetId).map(groups => {

                groups.data = groups.data.map((group: any) => {
                    const dataSource = new CategoryDataSource(group.categories);
                    return {...group, dataSource};
                });

                return groups;
            });
        });

        this.buildCategoryGroupForm();
        this.buildCategoryForm();
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

    public openCreateCategoryGroupDialog(groupCollection) {

        this.dialog.open(CategoryGroupDialogComponent, {
            data: {
                groupCollection: groupCollection,
                mode: 'CREATE'
            }
        })
    }

    public openUpdateCategoryGroupDialog(group: CategoryGroupId, groupCollection) {
        this.dialog.open(CategoryGroupDialogComponent, {
            data: {
                groupCollection: groupCollection,
                group: group,
                mode: 'UPDATE'
            }
        })
    }

    public openUpdateCategoryDialog(category: CategoryId, categoryCollection) {
        this.dialog.open(EditCategoryDialogComponent, {
            data: {
                category: category,
                categoryCollection: categoryCollection,
                mode: 'UPDATE'
            }
        });
    }

    public openCreateCategoryDialog(group: CategoryGroupId, categoryCollection) {
        this.dialog.open(EditCategoryDialogComponent, {
            data: {
                categoryCollection: categoryCollection,
                group: group,
                mode: 'CREATE',
            }
        });
    }

    public openCategoryTransferDialog(category: CategoryId) {

        this.getBudgetId().subscribe(budgetId => {

            this.dialog.open(TransferCategoryDialogComponent, {
                data: {
                    category: category,
                    budgetId: budgetId
                }
            });

        })
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
