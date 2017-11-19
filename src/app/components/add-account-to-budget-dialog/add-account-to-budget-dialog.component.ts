import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Account } from "../../services/database/database.service";

@Component({
    selector: 'app-add-account-to-budget-dialog',
    templateUrl: './add-account-to-budget-dialog.component.html',
    styleUrls: ['./add-account-to-budget-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddAccountToBudgetDialogComponent implements OnInit {

    public account: FormGroup;

    constructor(private dialogRef: MatDialogRef<AddAccountToBudgetDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: any) {
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
            const budgetAccount: Account = {
                userId: this.data.userId,
                budgetId: this.data.budgetId,
                accountName: form.accountName,
                accountType: form.accountType
            };

            this.data.budgetAccountCollection.add(budgetAccount).then(newAccount => {
                const newAccountId = newAccount.id;
                this.dialogRef.close(newAccountId);
            });
        }
    }

    public close() {
        this.dialogRef.close();
    }
}

