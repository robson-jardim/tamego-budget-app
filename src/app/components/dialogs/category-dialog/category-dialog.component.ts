import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category, CategoryId } from '../../../../../models/category.model';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { GeneralNotificationsService } from '../../../services/general-notifications/general-notifications.service';
import { CategoryGroupId } from '../../../../../models/category-group.model';

@Component({
    selector: 'app-edit-category-dialog',
    templateUrl: './category-dialog.component.html',
    styleUrls: ['./category-dialog.component.scss']
})
export class EditCategoryDialogComponent implements OnInit {

    public categoryForm: FormGroup;

    public readonly category: CategoryId;
    public readonly categoryCollection: AngularFirestoreCollection<Category>;
    public readonly mode: string;
    public readonly group: CategoryGroupId;

    constructor(private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private formBuilder: FormBuilder,
                private notifications: GeneralNotificationsService) {
        this.category = this.data.category;
        this.categoryCollection = this.data.categoryCollection;
        this.mode = this.data.mode.toUpperCase();
        this.group = this.data.group;
    }

    ngOnInit() {
        this.buildCategoryForm();
    }

    private buildCategoryForm(): void {

        if (this.mode == 'UPDATE') {
            this.categoryForm = this.formBuilder.group({
                categoryName: [this.category.categoryName, Validators.required]
            });
        }
        else {
            this.categoryForm = this.formBuilder.group({
                categoryName: ['', Validators.required]
            });
        }
    }

    public saveChanges() {

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
        if (this.categoryForm.pristine) {
            this.close();
            return;
        }

        const data = {
            categoryName: this.categoryForm.value.categoryName
        };

        this.categoryCollection.doc(this.category.categoryId).update(data);
        this.notifications.sendUpdateNotification('category');

        this.close();
    }

    private createCategory() {
        const data: Category = {
            groupId: this.group.groupId,
            categoryName: this.categoryForm.value.categoryName,
            position: 0
        };

        this.categoryCollection.add(data);
        this.notifications.sendCreateNotification('category');
        this.close();
    }
}
