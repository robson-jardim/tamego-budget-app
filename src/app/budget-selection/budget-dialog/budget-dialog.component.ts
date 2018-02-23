import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Budget, BudgetId } from '@models/budget.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { first, retryWhen } from 'rxjs/operators';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { EntityNames } from '@shared/enums/entity-names.enum';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';

enum BudgetFormNames {
    BudgetName = 'budgetName'
}

@Component({
    selector: 'app-add-budget-dialog',
    templateUrl: './budget-dialog.component.html',
    styleUrls: ['./budget-dialog.component.scss']
})
export class BudgetDialogComponent implements OnInit {

    public budgetForm: FormGroup;
    public saving = false;
    public DialogState = DialogState;
    public BudgetFormNames = BudgetFormNames;

    constructor(private dialogRef: MatDialogRef<BudgetDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private firestore: FirestoreService,
                private references: FirestoreReferenceService,
                private notifications: GeneralNotificationsService) {
    }

    ngOnInit() {
        this.buildBudgetForm();
    }

    private buildBudgetForm() {
        const form = new Object();
        form[BudgetFormNames.BudgetName] = [null, Validators.required];
        this.budgetForm = this.formBuilder.group(form);
    }

    public saveChanges() {

        this.saving = true;
        const currentTime = new Date();

        const data: Budget = {
            userId: this.data.userId,
            budgetName: this.budgetForm.value.budgetName,
            timeCreated: currentTime,
            lastVisited: currentTime
        };

        const budgets = this.getBudgetCollection();
        const budgetId = this.firestore.generateId();
        budgets.doc(budgetId).set(data);

        // This is a work around for an issue with get() inside the Firestore security rules.
        // The bug occurs when trying to access sub-collections on newly created documents.
        // Retry query sub-collections until they emit a value successfully. Only
        // then is is safe to query sub-collections without getting a permission denied error.
        // LINK: https://stackoverflow.com/questions/47818878/firestore-rule-failing-while-using-get-on-newly-created-documents
        const groups = this.firestore.getGroups(budgetId).collection.valueChanges();
        groups.pipe(
            retryWhen(permissionDenied),
            first()
        ).subscribe(() => {
            this.onBudgetAdded(budgetId);
            this.sendBudgetNotification();
        });

        function permissionDenied(errors) {
            return errors;
        }
    }

    private getBudgetCollection() {
        return this.references.getBudgetCollectionRef(this.data.userId);
    }

    private onBudgetAdded(budgetId: string): void {
        this.dialogRef.close(budgetId);
    }

    private sendBudgetNotification() {
        if (DialogState.Create === this.data.state) {
            this.notifications.sendCreateNotification(EntityNames.Budget);
        }
        else if (DialogState.Update === this.data.state) {
            this.notifications.sendUpdateNotification(EntityNames.Budget);
        }
        else if (DialogState.Delete === this.data.state) {
            this.notifications.sendDeleteNotification(EntityNames.Budget);
        }
    }
}