import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Budget } from '@models/budget.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { EntityNames } from '@shared/enums/entity-names.enum';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';
import { StringValidation } from '@shared/validators/string-validation';
import * as firebase from 'firebase';

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
        form[BudgetFormNames.BudgetName] = [this.data.budgetName, [Validators.required, StringValidation.NotEmptyStringValidator]];
        this.budgetForm = this.formBuilder.group(form);
    }

    public async saveChanges() {

        this.saving = true;
        const currentTime: Date = firebase.firestore.FieldValue.serverTimestamp() as any;

        const budgetData: Budget = {
            userId: this.data.userId,
            budgetName: this.budgetForm.value.budgetName.trim(),
            currencyCode: this.data.currencyCode || 'USD',
            timeCreated: this.data.timeCreated || currentTime,
            lastModified: this.data.lastModified || currentTime
        };

        if (DialogState.Create === this.data.state) {
            const budgets = this.getBudgetCollection();
            const budget = await budgets.add(budgetData);
            this.onBudgetAdded(budget.id);
        }
        else if (DialogState.Update === this.data.state) {
            const budgets = this.getBudgetCollection();
            budgets.doc(this.data.budgetId).update(budgetData);
        }
        else {
            throw new Error('Unable to determine dialog state');
        }

        this.dialogRef.close();
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
