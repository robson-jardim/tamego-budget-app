import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BudgetAccount, BudgetAccountId } from '@models/budget-account.model';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { CollectionResult } from '@models/collection-result.model';

enum AccountFormNames {
    AccountName = 'accountName'
}

@Component({
    selector: 'app-add-account-to-budget-dialog',
    templateUrl: './account-dialog.component.html',
    styleUrls: ['./account-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccountDialogComponent implements OnInit {

    public accountForm: FormGroup;
    public AccountFormNames = AccountFormNames;
    public DialogState = DialogState;

    constructor(private dialogRef: MatDialogRef<AccountDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private firestore: FirestoreService) {
    }

    ngOnInit() {
        this.buildAccountForm();
    }

    private buildAccountForm() {
        const form = new Object();
        form[AccountFormNames.AccountName] = [this.data.accountName, Validators.required];

        this.accountForm = this.formBuilder.group(form);
    }

    public saveChanges() {
        if (DialogState.Create === this.data.state) {
            this.createAccount();
        }
        else if (DialogState.Update === this.data.state) {
            this.updateAccount();
        }
    }

    private createAccount() {
        const accountsCollection = this.getAccounts().collection;

        const data: BudgetAccount = {
            accountName: this.accountForm.value.accountName,
            createdAt: new Date()
        };

        const newAccountId = this.firestore.generateId();
        accountsCollection.doc(newAccountId).set(data);
        this.dialogRef.close(newAccountId);
    }

    private updateAccount() {
        const accountsCollection = this.getAccounts().collection;

        const data: any = {
            accountName: this.accountForm.value[AccountFormNames.AccountName]
        };

        accountsCollection.doc(this.data.budgetAccountId).update(data);
        this.dialogRef.close();
    }

    private getAccounts(): CollectionResult<BudgetAccount, BudgetAccountId[]> {
        return this.firestore.getAccounts(this.data.budgetId);
    }

}

