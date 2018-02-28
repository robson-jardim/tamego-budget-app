import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '@models/category.model';
import { CategoryValue } from '@models/category-value.model';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';
import { EntityNames } from '@shared/enums/entity-names.enum';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';

enum CategoryFormNames {
    CategoryName = 'categoryName',
    Budgeted = 'budgeted',
    Offset = 'offset'
}

@Component({
    selector: 'app-edit-category-dialog',
    templateUrl: './category-dialog.component.html',
    styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {

    public categoryForm: FormGroup;
    public saving: boolean;

    public DialogState = DialogState;
    public CategoryFormNames = CategoryFormNames;

    constructor(private dialogRef: MatDialogRef<CategoryDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private formBuilder: FormBuilder,
                private notifications: GeneralNotificationsService,
                private references: FirestoreReferenceService) {
    }

    ngOnInit() {
        this.buildCategoryForm();
    }

    private buildCategoryForm(): void {

        const form = new Object();

        if (DialogState.Create === this.data.state) {
            form[CategoryFormNames.CategoryName] = [null, Validators.required];
            form[CategoryFormNames.Budgeted] = [0];
            form[CategoryFormNames.Offset] = [0];
        }
        else if (DialogState.Update === this.data.state) {
            form[CategoryFormNames.CategoryName] = [this.data.categoryName, Validators.required];
            form[CategoryFormNames.Budgeted] = [this.data.desiredValue.budgeted];
            form[CategoryFormNames.Offset] = [this.data.desiredValue.offset];
        }
        else {
            throw new Error('Unable to determine dialog state');
        }

        this.categoryForm = this.formBuilder.group(form);
    }

    public saveChanges() {
        this.saving = true;

        if (DialogState.Create === this.data.state) {
            this.createCategory();
        }
        else if (DialogState.Update === this.data.state) {
            this.updateCategoryAndValue();
        }
        else {
            throw new Error('Unable to determine dialog state');
        }

        this.sendCategoryNotification();
        this.dialogRef.close();
    }

    private createCategory() {
        this.getCategoryCollection().add(this.getCategoryData());
    }

    private updateCategoryAndValue() {
        this.updateCategory();
        this.saveCategoryValue();
    }

    private updateCategory() {
        this.getCategoryCollection().doc(this.data.categoryId).update(this.getCategoryData());
    }

    private getCategoryData(): Category {
        const getPosition = () => {
            if (this.data.position !== undefined) {
                return this.data.position;
            }
            else {
                return this.data.nextCategoryPosition;
            }
        };

        return {
            groupId: this.data.groupId,
            categoryName: this.categoryForm.value[CategoryFormNames.CategoryName],
            position: getPosition()
        };
    }

    private saveCategoryValue() {

        const valueDocExists = () => this.data.desiredValue.exists;
        const categoryValuesAreZero = () => this.categoryForm.value[CategoryFormNames.Budgeted] === 0 && this.categoryForm.value[CategoryFormNames.Offset] === 0;
        const getCategoryId = () => this.data.categoryId;
        const getValueBudgetMonth = () => this.data.desiredValue.budgetMonth;

        const getBudgetedValue = () => {
            const budgeted = this.categoryForm.value[CategoryFormNames.Budgeted] || 0;
            // Sets precision to 2 decimal places
            return Number(budgeted.toFixed(2));
        };

        const getOffsetValue = () => {
            const offset = this.categoryForm.value[CategoryFormNames.Offset] || 0;
            // Sets precision to 2 decimal places
            return Number(offset.toFixed(2));
        };

        const generateValueId = () => {
            let month = this.data.desiredValue.budgetMonth.getUTCMonth() + 1;
            const year = this.data.desiredValue.budgetMonth.getUTCFullYear();
            const categoryId = this.data.categoryId;

            if (month < 10) {
                // Formats months to always contain 2 characters
                month = '0' + month;
            }

            // Value ID is generated this way to avoid duplicate documents for the same category.
            // Although a category may have many categoryValues, only a single categoryValue is allowed for a specific
            // year and month. By putting both in the value ID, possible duplicates will overwrite each other,
            // which is the desired outcome for offline capabilities. The most recently made document is the one
            // that will persist in Firestore.
            return `${categoryId}_${year}-${month}`;
        };

        if (valueDocExists()) {
            if (categoryValuesAreZero()) {
                // Delete empty values because delete operations are cheaper than continuing to read empty entities
                this.getCategoryValuesCollection().doc(generateValueId()).delete();
            }
            else {
                const data = {
                    budgeted: getBudgetedValue(),
                    offset: getOffsetValue()
                };

                this.getCategoryValuesCollection().doc(generateValueId()).update(data);
            }
        }
        else {
            if (!categoryValuesAreZero()) {
                const data: CategoryValue = {
                    budgeted: getBudgetedValue(),
                    offset: getOffsetValue(),
                    budgetMonth: getValueBudgetMonth(),
                    categoryId: getCategoryId()
                };

                this.getCategoryValuesCollection().doc(generateValueId()).set(data);
            }
        }
    }

    public getCategoryCollection() {
        return this.references.getCategoriesCollectionRef(this.data.budgetId);
    }

    public getCategoryValuesCollection() {
        return this.references.getCategoryValuesCollectionRef(this.data.budgetId);
    }

    private sendCategoryNotification() {
        if (DialogState.Create === this.data.state) {
            this.notifications.sendCreateNotification(EntityNames.Category);
        }
        else if (DialogState.Update === this.data.state) {
            this.notifications.sendUpdateNotification(EntityNames.Category);
        }
        else if (DialogState.Delete === this.data.state) {
            this.notifications.sendDeleteNotification(EntityNames.Category);
        }
    }
}
