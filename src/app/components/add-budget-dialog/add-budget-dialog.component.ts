import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Budget, BudgetId } from '../budget-selection/budget-selection.component';
import { MAT_DIALOG_DATA } from "@angular/material";
import { User } from "../../services/auth-service/auth.service";

@Component({
    selector: 'app-add-budget-dialog',
    templateUrl: './add-budget-dialog.component.html',
    styleUrls: ['./add-budget-dialog.component.scss'],
})
export class AddBudgetDialogComponent implements OnInit {

    private budget: FormGroup;

    constructor(private dialogRef: MatDialogRef<AddBudgetDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: any) {
    }

    ngOnInit() {
        this.buildBudgetForm();
    }

    private onBudgetAdded(newBudgetId: string): void {
        this.dialogRef.close(newBudgetId);
    }
    private cancel() : void {
        this.dialogRef.close();
    }

    private buildBudgetForm() : void {
        this.budget = this.formBuilder.group({
            budgetName: ['', Validators.required],
            currencyType: ['', Validators.required]
        });
    }

    public addBudget(formValues): void {

        if (this.budget.valid) {

            const budget: Budget = {
                userId: this.data.userId,
                budgetName: formValues.budgetName,
                currencyType: formValues.currencyType
            };

            this.data.budgetCollection.add(budget).then(newBudget => {
                this.onBudgetAdded(newBudget.id);
            });
        }
    }

}
