import { Component, OnInit, ViewEncapsulation, group } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CategoryGroup } from '../../../../models/category-group.model';
import { Category } from '../../../../models/category.model';
import { FirestoreReferenceService } from '../../services/firestore-reference/firestore-reference.service';
import { FormatFirestoreDataService } from '../../services/format-firestore-data/format-firestore-data.service';
import { FirestoreResult } from '../../../../models/firestore-result.model';

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

    public groupings: FirestoreResult<any>;

    constructor(private firestoreRef: FirestoreReferenceService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private formatFirestoreData: FormatFirestoreDataService) {
    }

    ngOnInit() {

        this.route.parent.params.subscribe(params => {
            const budgetId = params.budgetId;

            this.groupings = this.formatFirestoreData.combineGroupAndCategories(budgetId);

            this.formatFirestoreData.combineGroupAndCategories(budgetId).observable.subscribe(x => {
                console.log(x);
            });
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

    // public addCategoryGroup(form) {
    //     const g: CategoryGroup = {
    //         groupName: form.groupName
    //     };

    //     this.groupCollection.add(g);
    // }

    // public addCategory(form, groupId) {
    //     const category: Category = {
    //         categoryName: form.categoryName,
    //         groupId: groupId
    //     };

    //     this.categoryCollection.add(category);
    // }

    // public deleteGroup(groupId: string) {
    //     this.groupCollection.doc(groupId).delete();
    // }

    // public deleteCategory(categoryId: string) {
    //     this.categoryCollection.doc(categoryId).delete();
    // }


}

export interface BudgetGroup {
    groupName: string;
    categories: Array<Category>;
};
