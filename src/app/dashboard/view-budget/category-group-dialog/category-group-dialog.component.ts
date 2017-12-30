import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EditCategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { CategoryGroup, CategoryGroupId } from '../../../../../models/category-group.model';
import { GeneralNotificationsService } from '../../../../shared/services/general-notifications/general-notifications.service';

@Component({
    selector: 'app-category-group-dialog',
    templateUrl: './category-group-dialog.component.html',
    styleUrls: ['./category-group-dialog.component.scss']
})
export class CategoryGroupDialogComponent implements OnInit {

    public groupForm: FormGroup;

    public saving = false;

    public readonly groupCollection: AngularFirestoreCollection<CategoryGroup>;
    public readonly group: CategoryGroupId;
    public readonly mode: string;
    public readonly nextGroupPosition: number;

    constructor(private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private formBuilder: FormBuilder,
                private notifications: GeneralNotificationsService) {
        this.groupCollection = this.data.groupCollection;
        this.group = this.data.group;
        this.nextGroupPosition = this.data.nextGroupPosition;
        this.mode = this.data.mode;
    }

    ngOnInit() {
        this.buildGroupForm();
    }

    private buildGroupForm(): void {

        if (this.mode == 'UPDATE') {
            this.groupForm = this.formBuilder.group({
                groupName: [this.group.groupName, Validators.required]
            });
        }
        else {
            this.groupForm = this.formBuilder.group({
                groupName: ['', Validators.required]
            });
        }

    }

    public saveChanges() {
        this.saving = true;

        if (this.mode === 'UPDATE') {
            this.editCategoryGroup();
        }

        if (this.mode === 'CREATE') {
            this.addCategoryGroup();
        }
    }

    private close() {
        this.dialogRef.close();
    }


    private addCategoryGroup() {
        const data: CategoryGroup = {
            groupName: this.groupForm.value.groupName,
            position: this.nextGroupPosition
        };

        this.groupCollection.add(data);
        this.notifications.sendCreateNotification('Category group');
        this.close();
    }

    private editCategoryGroup() {

        if (this.groupForm.pristine) {
            this.close();
            return;
        }

        const data = {
            groupName: this.groupForm.value.groupName
        };

        this.groupCollection.doc(this.group.groupId).update(data);
        this.notifications.sendUpdateNotification('Category group');
        this.close();
    }
}
