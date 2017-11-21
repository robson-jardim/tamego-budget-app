import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    Category, CategoryGroup, CategoryGroupId, CategoryId,
    DatabaseService
} from "../../services/database/database.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestoreCollection } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { combineLatest } from "rxjs/observable/combineLatest";

@Component({
    selector: 'app-budget',
    templateUrl: './edit-budget.component.html',
    styleUrls: ['./edit-budget.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditBudgetComponent implements OnInit {

    public categoryForm: FormGroup;
    public groupForm: FormGroup;

    private groupCollection: AngularFirestoreCollection<CategoryGroup>;
    public groups: Observable<CategoryGroupId[]>;

    private categoryCollection: AngularFirestoreCollection<Category>;
    public categories: Observable<CategoryId[]>;

    constructor (private db: DatabaseService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    }

    ngOnInit () {

        this.route.parent.params.subscribe(params => {
            let budgetId = params.budgetId;

            this.groupCollection = this.db.getCategoryGroupCollection(budgetId);
            this.groups = this.db.getCategoryGroupsWithIds(this.groupCollection);

            this.categoryCollection = this.db.getCategoryCollection(budgetId);
            this.categories = this.db.getCategoriesWithIds(this.categoryCollection);
        });

        this.buildCategoryGroupForm();
        this.buildCategoryForm();
    }

    private buildCategoryGroupForm () {
        this.groupForm = this.formBuilder.group({
            groupName: ['', Validators.required]
        });
    }

    private buildCategoryForm () {
        this.categoryForm = this.formBuilder.group({
            categoryName: ['', Validators.required]
        });
    }

    public addCategoryGroup (form) {
        const group: CategoryGroup = {
            name: form.groupName
        };

        this.groupCollection.add(group);
    }

    public addCategory(form, groupId) {
        const category: Category = {
            name: form.categoryName,
            groupId: groupId
        };

        this.categoryCollection.add(category);
    }

    public deleteGroup (groupId: string) {
        this.groupCollection.doc(groupId).delete();
    }

    public deleteCategory(categoryId: string) {
        this.categoryCollection.doc(categoryId).delete();
    }
}
