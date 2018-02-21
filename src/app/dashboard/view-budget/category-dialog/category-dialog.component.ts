import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '@models/category.model';
import { CategoryValue } from '@models/category-value.model';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';
import { EntityNames } from '@shared/enums/entity-names.enum';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { TransactionFormNames } from '../../view-transactions/shared/transaction-form-names.enum';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';


@Component({
    selector: 'app-edit-category-dialog',
    templateUrl: './category-dialog.component.html',
    styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {

    public categoryForm: FormGroup;
    public DialogState = DialogState;

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
            form['categoryName'] = [null, Validators.required];
        }
        else if (DialogState.Update === this.data.state) {
            form['categoryName'] = [this.data.categoryName, Validators.required];
            form['budgeted'] = [this.data.desiredValue.budgeted || 0, Validators.required];
            form['offset'] = [this.data.desiredValue.offset, Validators.required];
        }

        this.categoryForm = this.formBuilder.group(form);
    }

    public saveChanges() {

        if (DialogState.Create === this.data.state) {
            this.createCategory();
        }
        else if (DialogState.Update === this.data.state) {
            this.updateCategory();
        }
        else {
            throw new Error('Unable to determine dialog state');
        }

        this.sendCategoryNotification();
        this.dialogRef.close();
    }

    private createCategory() {
        const data: Category = {
            groupId: this.data.groupId,
            categoryName: this.categoryForm.value.categoryName,
            position: this.data.nextCategoryPosition
        };

        this.getCategoryCollection().add(data);
    }

    private updateCategory() {
        this.updateCategoryEntity();
        this.saveCategoryValueChanges();
    }

    private updateCategoryEntity() {
        const data = {
            categoryName: this.categoryForm.value.categoryName
        };

        this.getCategoryCollection().doc(this.data.categoryId).update(data);
    }

    private saveCategoryValueChanges() {

        const valueDocExists = () => this.data.desiredValue.exists;
        const categoryValuesAreZero = () => this.categoryForm.value.budgeted === 0 && this.categoryForm.value.offset === 0;
        const getCategoryId = () => this.data.categoryId;
        const getValueTime = () => this.data.desiredValue.budgetMonth;

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
                    budgetMonth: getValueTime(),
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
