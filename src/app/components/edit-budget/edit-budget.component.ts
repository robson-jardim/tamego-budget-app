import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { CategoryGroup, CategoryGroupId } from '../../../../models/category-group.model';
import { FirestoreService } from '../../services/firestore/firestore.service';
import 'rxjs/add/operator/skip';
import { CategoryId } from '../../../../models/category.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-budget',
    templateUrl: './edit-budget.component.html',
    styleUrls: ['./edit-budget.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditBudgetComponent implements OnInit {

    public categoryForm: FormGroup;
    public groupForm: FormGroup;

    private groupsAndCategories;

    public categoryColumns = ['categoryId', 'categoryName', 'groupId', 'actions'];
    public groups;

    constructor(private firestore: FirestoreService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.route.parent.params.subscribe(params => {
            const budgetId = params.budgetId;

            // Sets data on initial load and on any updates to group data
            this.getData(budgetId);

            // Updates all data if any categories change
            // Skip first emission to avoid setting the data twice on the initial load
            this.groupsAndCategories.subObservable.skip(1).subscribe(()=> {
                this.getData(budgetId);
            })
        });

        this.buildCategoryGroupForm();
        this.buildCategoryForm();
    }

    public getData(budgetId: string) {
        this.groupsAndCategories = this.firestore.getGroupsAndCategories(budgetId);
        this.groupsAndCategories.mainObservable.subscribe(data => {
            this.buildBudgetTableDataSources(data);
        });
    }

    selectedRowIndex: number = -1;

    highlight(row){
        this.selectedRowIndex = row.categoryId;
    }

    unhighlight(row) {
        this.selectedRowIndex = -1;
    }

    private buildBudgetTableDataSources(groups: any) {

        const temp = [];

        for(let ix = 0; ix < groups.length; ix++) {

            let group = {
                dataSource: new CategoryDataSource(groups[ix].categories),
                groupId: groups[ix].groupId,
                groupName: groups[ix].groupName,
                categories: groups[ix].categories
            };

            temp.push(group);
        }

        this.groups = temp;

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

    disconnect() {}
}
