import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Budget } from '../../../../../models/budget.model';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { FirestoreService } from '../../../services/firestore/firestore.service';

@Component({
    selector: 'app-add-budget-dialog',
    templateUrl: './add-budget-dialog.component.html',
    styleUrls: ['./add-budget-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddBudgetDialogComponent implements OnInit {

    public budgetForm: FormGroup;

    private budgetCollection: AngularFirestoreCollection<Budget>;
    private userId: string;

    public saving = false;

    constructor(private dialogRef: MatDialogRef<AddBudgetDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: any) {
        this.budgetCollection = data.budgetCollection;
        this.userId = data.userId;
    }

    ngOnInit() {
        this.buildBudgetForm();
    }

    private buildBudgetForm(): void {
        this.budgetForm = this.formBuilder.group({
            budgetName: ['', Validators.required],
            currencyType: ['', Validators.required]
        });
    }

    public async addBudget() {

        this.saving = true;

        const data: Budget = {
            userId: this.data.userId,
            budgetName: this.budgetForm.value.budgetName,
            currencyType: this.budgetForm.value.currencyType
        };

        try {
            const newBudget = await this.budgetCollection.add(data);
            this.onBudgetAdded(newBudget.id);
            this.saving = false;
        } catch (error) {
            console.error(error);
        }
    }

    private onBudgetAdded(newBudgetId: string): void {
        this.dialogRef.close(newBudgetId);
    }
}
