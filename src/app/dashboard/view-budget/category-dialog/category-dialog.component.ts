import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Category } from '../../../../../models/category.model';
import { CategoryValue } from '../../../../../models/category-value.model';
import { GeneralNotificationsService } from '../../../../shared/services/general-notifications/general-notifications.service';

@Component({
    selector: 'app-edit-category-dialog',
    templateUrl: './category-dialog.component.html',
    styleUrls: ['./category-dialog.component.scss']
})
export class EditCategoryDialogComponent implements OnInit {

    public saving = false;
    public categoryForm: FormGroup;

    // Shared resources by all modes
    public readonly mode: string; // Possible modes are CREATE/UPDATE
    public readonly categoryCollection: AngularFirestoreCollection<Category>;

    // UPDATE mode specific
    public readonly category: any; // Altered version of the category entity that contains data about the current category value given the current budget view
    public readonly categoryValueCollection: AngularFirestoreCollection<CategoryValue>;

    // CREATE mode specific
    public readonly group: any; // Altered version of the categoryGroup entity that contains an array of categories
    public readonly nextCategoryPosition: number;

    constructor(private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private formBuilder: FormBuilder,
                private notifications: GeneralNotificationsService) {

        this.mode = this.data.mode.toUpperCase();
        this.categoryCollection = this.data.categoryCollection;

        this.category = this.data.category;
        this.categoryValueCollection = this.data.categoryValueCollection;

        this.group = this.data.group;
        this.nextCategoryPosition = this.data.nextCategoryPosition;
    }

    ngOnInit() {
        this.buildCategoryForm();
    }

    private buildCategoryForm(): void {

        if (this.mode === 'UPDATE') {
            this.categoryForm = this.formBuilder.group({
                categoryName: [this.category.categoryName, Validators.required],
                budgeted: [this.category.desiredValue.budgeted, Validators.required],
                offset: [this.category.desiredValue.offset, Validators.required]
            });
        }
        else {
            this.categoryForm = this.formBuilder.group({
                categoryName: ['', Validators.required]
            });
        }
    }

    public saveChanges() {

        this.saving = true;

        if (this.mode === 'UPDATE') {
            this.updateCategory();
        }

        if (this.mode === 'CREATE') {
            this.createCategory();
        }
    }

    private close() {
        this.dialogRef.close();
    }

    private updateCategory() {

        this.updateCategoryEntity();
        this.saveCategoryValueChanges();

        this.notifications.sendUpdateNotification('category');
        this.close();
    }

    private saveCategoryValueChanges() {

        const valueDocExists = () => this.category.desiredValue.exists;
        const categoryValuesAreZero = () => this.categoryForm.value.budgeted === 0 && this.categoryForm.value.offset === 0;
        const getCategoryId = () => this.category.categoryId;
        const getValueTime = () => this.category.desiredValue.budgetMonth;

        const getBudgetedValue = () => {
            const budgeted = this.categoryForm.value.budgeted;
            // Sets precision to 2 decimal places
            return Number(budgeted.toFixed(2));
        };

        const getOffsetValue = () => {
            const offset = this.categoryForm.value.offset;
            // Sets precision to 2 decimal places
            return Number(offset.toFixed(2));
        };

        const generateValueId = () => {
            let month = this.category.desiredValue.budgetMonth.getUTCMonth() + 1;
            const year = this.category.desiredValue.budgetMonth.getUTCFullYear();
            const categoryId = this.category.categoryId;

            if (month < 10) {
                // Formats months to always contain 2 characters
                month = '0' + month;
            }

            // Value ID is generated this way to avoid duplicate documents for the same category.
            // Although a category may have many categoryValues, only a single categoryValue is allowed for a specific
            // year and month. By putting both in the value ID, possible duplicates will overwrite each other,
            // which is the desired outcome for offline capabilities. The most recently made document is the one
            // that will persist in Firestore.
            return `${categoryId}-${year}-${month}`;
        };


        if (valueDocExists()) {
            if (categoryValuesAreZero()) {
                // Delete empty values because delete operations are cheaper than continuing to read empty entities
                this.categoryValueCollection.doc(generateValueId()).delete();
            }
            else {
                const data = {
                    budgeted: getBudgetedValue(),
                    offset: getOffsetValue()
                };

                this.categoryValueCollection.doc(generateValueId()).update(data);
            }
        }
        else {
            if (!categoryValuesAreZero()) {
                const data: CategoryValue = {
                    budgeted: getBudgetedValue(),
                    offset: getOffsetValue(),
                    budgetMonth: getValueTime(),
                    categoryId: getCategoryId()
                };

                this.categoryValueCollection.doc(generateValueId()).set(data);
            }
        }

    }

    private updateCategoryEntity() {
        const data = {
            categoryName: this.categoryForm.value.categoryName
        };

        this.categoryCollection.doc(this.category.categoryId).update(data);
    }

    private createCategory() {
        const data: Category = {
            groupId: this.group.groupId,
            categoryName: this.categoryForm.value.categoryName,
            position: this.nextCategoryPosition
        };

        this.categoryCollection.add(data);
        this.notifications.sendCreateNotification('category');
        this.close();
    }


}
