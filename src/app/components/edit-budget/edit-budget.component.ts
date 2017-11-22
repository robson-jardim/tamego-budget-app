import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../../services/database/database.service';
import { CategoryGroup, CategoryGroupId } from '../../../../models/category-group.model';
import { Category, CategoryId } from '../../../../models/category.model';

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
    private categoryCollection: AngularFirestoreCollection<Category>;

    public groupings: any;

    constructor(private db: DatabaseService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.route.parent.params.subscribe(params => {
            const budgetId = params.budgetId;

            this.groupings = this.db.combineGroupAndCategories(budgetId);
            this.groupCollection = this.db.getCategoryGroupCollection(budgetId);
        });

        this.buildCategoryGroupForm();
        this.buildCategoryForm();
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

    public addCategoryGroup(form) {
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

    public deleteGroup(groupId: string) {
        this.groupCollection.doc(groupId).delete();
    }

    public deleteCategory(categoryId: string) {
        this.categoryCollection.doc(categoryId).delete();
    }


}

export interface BudgetGroup {
    groupName: string;
    categories: Array<Category>;
};
