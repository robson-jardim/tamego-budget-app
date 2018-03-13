import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Account } from '@models/budget-account.model';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { EntityNames } from '@shared/enums/entity-names.enum';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';

enum AccountFormNames {
    AccountName = 'accountName'
}

@Component({
    selector: 'app-add-account-to-budget-dialog',
    templateUrl: './account-dialog.component.html',
    styleUrls: ['./account-dialog.component.scss'],
})
export class AccountDialogComponent implements OnInit {

    public accountForm: FormGroup;
    public AccountFormNames = AccountFormNames;
    public DialogState = DialogState;
    public saving: boolean;

    constructor(private dialogRef: MatDialogRef<AccountDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private references: FirestoreReferenceService,
                private firestore: FirestoreService,
                private notifications: GeneralNotificationsService) {
    }

    ngOnInit() {
        this.buildAccountForm();
    }

    private buildAccountForm() {
        const form = new Object();
        form[AccountFormNames.AccountName] = [this.data.accountName, Validators.required];
        this.accountForm = this.formBuilder.group(form);
    }

    public async saveChanges() {
        this.saving = true;

        if (DialogState.Create === this.data.state) {
            const newAccountId = await this.createAccount();
            this.dialogRef.close(newAccountId);
        }
        else if (DialogState.Update === this.data.state) {
            this.updateAccount();
            this.dialogRef.close();
        }
        else {
            throw new Error('Unable to determine dialog state');
        }

        this.sendAccountNotification();
    }

    private async createAccount() {
        const account = await this.getAccounts().add(this.getAccountData());
        return account.id;
    }

    private updateAccount() {
        this.getAccounts().doc(this.data.accountId).update(this.getAccountData());

    }

    private getAccountData(): Account {
        const isNumber = (num) => !isNaN(num);
        const getPosition = () => {
            if (isNumber(this.data.position)) {
                return this.data.position;
            }
            else {
                return this.data.nextAccountPosition;
            }
        };

        return {
            accountName: this.accountForm.value[AccountFormNames.AccountName],
            createdAt: this.data.createdAtAt || new Date(),
            position: getPosition()
        };
    }

    private getAccounts() {
        return this.references.getAccountsCollectionRef(this.data.budgetId);
    }

    private sendAccountNotification() {
        if (DialogState.Create === this.data.state) {
            this.notifications.sendCreateNotification(EntityNames.Account);
        }
        else if (DialogState.Update === this.data.state) {
            this.notifications.sendUpdateNotification(EntityNames.Account);
        }
        else if (DialogState.Delete === this.data.state) {
            this.notifications.sendDeleteNotification(EntityNames.Account);
        }
    }

}

