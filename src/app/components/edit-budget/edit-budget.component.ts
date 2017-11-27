import { Component, OnInit, ViewEncapsulation, group } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CategoryGroup, CategoryGroupId, GroupAndCategories } from '../../../../models/category-group.model';
import { Category, CategoryId } from '../../../../models/category.model';
import { FirestoreReferenceService } from '../../services/firestore-reference/firestore-reference.service';
import { CollectionResult } from '../../../../models/collection-result.model';
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
    selector: 'app-budget',
    templateUrl: './edit-budget.component.html',
    styleUrls: ['./edit-budget.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditBudgetComponent implements OnInit {

    public categoryForm: FormGroup;
    public groupForm: FormGroup;

    public groupsAndCategories;

    constructor(private firestore: FirestoreService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.route.parent.params.subscribe(params => {
            const budgetId = params.budgetId;
            this.groupsAndCategories = this.firestore.getGroupsAndCategories(budgetId);
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

    public addCategoryGroup(form, groupCollection: AngularFirestoreCollection<CategoryGroup>) {
        const newGroup: CategoryGroup = {
            groupName: form.groupName
        };

        groupCollection.add(newGroup);
    }

    public deleteCategoryGroup(categoryGroup: CategoryGroupId) {
        this.groupsAndCategories.collection.doc(categoryGroup.groupId).delete();
    }

    public addCategoryToGroup(form, group: GroupAndCategories) {
        const newCategory: Category = {
            categoryName: form.categoryName,
        };

        group.categories.collection.add(newCategory);
    }

    public deleteCategoryFromGroup(category: CategoryId, group: GroupAndCategories) {
        group.categories.collection.doc(category.categoryId).delete();
    }

}


