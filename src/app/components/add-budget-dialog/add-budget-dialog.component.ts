import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from "@angular/material";
import { Budget } from "../../services/database/database.service";

@Component({
    selector: 'app-add-budget-dialog',
    templateUrl: './add-budget-dialog.component.html',
    styleUrls: ['./add-budget-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddBudgetDialogComponent implements OnInit {

    public budget: FormGroup;

    constructor(private dialogRef: MatDialogRef<AddBudgetDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: any) {
    }

    ngOnInit() {
        this.buildBudgetForm();
    }

    private buildBudgetForm(): void {
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

    private onBudgetAdded(newBudgetId: string): void {
        this.dialogRef.close(newBudgetId);
    }

    public close(): void {
        this.dialogRef.close();
    }
}
