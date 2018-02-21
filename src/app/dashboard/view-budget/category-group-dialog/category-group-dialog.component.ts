import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { CategoryGroup } from '@models/category-group.model';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';
import { EntityNames } from '@shared/enums/entity-names.enum';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';

@Component({
    selector: 'app-category-group-dialog',
    templateUrl: './category-group-dialog.component.html',
    styleUrls: ['./category-group-dialog.component.scss']
})
export class CategoryGroupDialogComponent implements OnInit {

    public groupForm: FormGroup;
    public DialogState = DialogState;
    public saving: boolean;

    constructor(private dialogRef: MatDialogRef<CategoryDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private formBuilder: FormBuilder,
                private notifications: GeneralNotificationsService,
                private references: FirestoreReferenceService) {
    }

    ngOnInit() {
        this.buildGroupForm();
    }

    private buildGroupForm(): void {
        this.groupForm = this.formBuilder.group({
            groupName: [this.data.groupName || null, Validators.required]
        });
    }

    public saveChanges() {
        this.saving = true;

        if (DialogState.Create === this.data.state) {
            this.createCategoryGroup();
        }
        else if (DialogState.Update === this.data.state) {
            this.updateCategoryGroup();
        }
        else {
            throw new Error('Unable to determine dialog state');
        }

        this.sendCategoryGroupNotification();
        this.dialogRef.close();
    }

    private createCategoryGroup() {
        this.getCategoryGroupCollection().add(this.getCategoryGroupData());
    }

    private updateCategoryGroup() {
        this.getCategoryGroupCollection().doc(this.data.groupId).update(this.getCategoryGroupData());
    }

    private getCategoryGroupData(): CategoryGroup {

        const getPosition = () => {

            if (this.data.position !== undefined) {
                return this.data.position;
            }
            else {
                return this.data.nextGroupPosition;
            }
        };

        return {
            groupName: this.groupForm.value.groupName,
            position: getPosition()
        };
    }

    private getCategoryGroupCollection() {
        return this.references.getGroupsCollectionRef(this.data.budgetId);
    }

    private sendCategoryGroupNotification() {
        if (DialogState.Create === this.data.state) {
            this.notifications.sendCreateNotification(EntityNames.CategoryGroup);
        }
        else if (DialogState.Update === this.data.state) {
            this.notifications.sendUpdateNotification(EntityNames.CategoryGroup);
        }
        else if (DialogState.Delete === this.data.state) {
            this.notifications.sendDeleteNotification(EntityNames.CategoryGroup);
        }
    }

}
