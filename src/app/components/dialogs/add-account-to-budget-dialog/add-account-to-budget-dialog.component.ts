import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BudgetAccount } from '../../../../../models/budget-account.model';

@Component({
    selector: 'app-add-account-to-budget-dialog',
    templateUrl: './add-account-to-budget-dialog.component.html',
    styleUrls: ['./add-account-to-budget-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddAccountToBudgetDialogComponent implements OnInit {

    public account: FormGroup;
    private budgetAccountCollection: AngularFirestoreCollection<BudgetAccount>;

    constructor(private dialogRef: MatDialogRef<AddAccountToBudgetDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: any) {
        this.budgetAccountCollection = this.data.budgetAccountCollection;
    }

    ngOnInit() {
        this.buildAccountForm();
    }

    private buildAccountForm() {
        this.account = this.formBuilder.group({
            accountName: ['', Validators.required],
            accountType: ['', Validators.required]
        });
    }

    public addAccountToBudget(form) {
        if (this.account.valid) {
            const budgetAccount: BudgetAccount = {
                accountName: form.accountName,
                accountType: form.accountType
            };

            this.budgetAccountCollection.add(budgetAccount).then(newAccount => {
                const newAccountId = newAccount.id;
                this.dialogRef.close(newAccountId);
            });
        }
    }

    private close() {
        this.dialogRef.close();
    }
}

