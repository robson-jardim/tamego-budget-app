import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BudgetAccount } from '@models/budget-account.model';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';

@Component({
    selector: 'app-add-account-to-budget-dialog',
    templateUrl: './account-dialog.component.html',
    styleUrls: ['./account-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccountDialogComponent implements OnInit {

    public DialogState = DialogState;
    public accountForm: FormGroup;
    private budgetAccountCollection: AngularFirestoreCollection<BudgetAccount>;

    constructor(private dialogRef: MatDialogRef<AccountDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: any) {
        this.budgetAccountCollection = this.data.budgetAccountCollection;
    }

    ngOnInit() {
        this.buildAccountForm();
    }

    private buildAccountForm() {
        this.accountForm = this.formBuilder.group({
            accountName: ['', Validators.required],
            accountType: ['', Validators.required]
        });
    }

    public addAccountToBudget(form) {
        const budgetAccount: BudgetAccount = {
            accountName: form.accountName,
            accountType: form.accountType
        };

        this.budgetAccountCollection.add(budgetAccount).then(newAccount => {
            const newAccountId = newAccount.id;
            this.dialogRef.close(newAccountId);
        });
    }

    private close() {
        this.dialogRef.close();
    }
}

