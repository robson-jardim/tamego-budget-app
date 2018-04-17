import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Account } from '@models/budget-account.model';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { EntityNames } from '@shared/enums/entity-names.enum';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';
import { StringValidation } from '@shared/validators/string-validation';
import { CurrencyValidation } from '@shared/validators/currency-validation';
import { SplitTransaction, Transaction } from '@models/transaction.model';
import { Payee } from '@models/payee.model';
import { UtilityService } from '@shared/services/utility/utility.service';

enum AccountFormNames {
    AccountName = 'accountName',
    StartingBalance = 'startingBalance'
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
                private notifications: GeneralNotificationsService,
                private utility: UtilityService) {
    }

    ngOnInit() {
        this.buildAccountForm();
    }

    private buildAccountForm() {
        const form = new Object();

        form[AccountFormNames.AccountName] = [this.data.accountName, [Validators.required, StringValidation.NotEmptyStringValidator]];

        if (DialogState.Create === this.data.state) {
            form[AccountFormNames.StartingBalance] = [0, CurrencyValidation.MatchIsCurrencyValue];
        }

        this.accountForm = this.formBuilder.group(form);
    }

    public async saveChanges() {
        this.saving = true;

        if (DialogState.Create === this.data.state) {

            const batch = this.firestore.batch();

            const accountId = this.firestore.createId();
            const accountDocRef = this.getAccounts().doc(accountId).ref;
            batch.set(accountDocRef, this.getAccountData());

            const payee: Payee = {
                payeeName: 'Transfer: ' + this.accountForm.value[AccountFormNames.AccountName].trim()
            };

            const payeeId = this.firestore.createId();
            const payeeDocRef = this.getPayees().doc(payeeId).ref;
            batch.set(payeeDocRef, payee);


            if (this.accountForm.value[AccountFormNames.StartingBalance] !== 0) {

                const transaction: Transaction = {
                    transactionDate: this.utility.convertToUtc(new Date()),
                    accountId: accountId,
                    payeeId: null,
                    categoryId: null,
                    splits: [],
                    memo: 'Starting Balance',
                    amount: this.accountForm.value[AccountFormNames.StartingBalance],
                    cleared: false,
                    locked: false
                };

                const transactionId = this.firestore.createId();
                const transactionDocRef = this.getTransactions().doc(transactionId).ref;
                batch.set(transactionDocRef, transaction);

            }

            await batch.commit();
            this.dialogRef.close(accountId);
        }
        else if (DialogState.Update === this.data.state) {
            this.getAccounts().doc(this.data.accountId).update(this.getAccountData());
            this.dialogRef.close();
        }
        else {
            throw new Error('Unable to determine dialog state');
        }

        this.sendAccountNotification();
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
            accountName: this.accountForm.value[AccountFormNames.AccountName].trim(),
            position: getPosition()
        };
    }

    private getAccounts() {
        return this.references.getAccountsCollectionRef(this.data.budgetId);
    }

    private getTransactions() {
        return this.references.getTransactionCollectionRef(this.data.budgetId);
    }

    private getPayees() {
        return this.references.getPayeeCollectionRef(this.data.budgetId);
    }

    private sendAccountNotification() {
        if (DialogState.Create === this.data.state) {
            this.notifications.sendCreateNotification(EntityNames.Account);
        }
        else if (DialogState.Update === this.data.state) {
            this.notifications.sendUpdateNotification(EntityNames.Account);
        }
    }

}

