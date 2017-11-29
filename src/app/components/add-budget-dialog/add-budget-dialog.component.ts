import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Budget } from '../../../../models/budget.model';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
    selector: 'app-add-budget-dialog',
    templateUrl: './add-budget-dialog.component.html',
    styleUrls: ['./add-budget-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddBudgetDialogComponent implements OnInit {

    public budget: FormGroup;

    private budgetCollection: AngularFirestoreCollection<Budget>;
    private userId: string;

    constructor(private dialogRef: MatDialogRef<AddBudgetDialogComponent>,
                private formBuilder: FormBuilder,
                private firestore: FirestoreService,
                @Inject(MAT_DIALOG_DATA) private data: any) {
        this.budgetCollection = data.budgetCollection;
        this.userId = data.userId;
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

            this.budgetCollection.add(budget).then(newBudget => {
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
