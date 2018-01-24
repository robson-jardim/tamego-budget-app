import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Observable } from 'rxjs/Observable';
import { CollectionResult } from '@models/collection-result.model';
import { Transaction, TransactionId } from '@models/transaction.model';
import { Payee } from '@models/payee.model';
import { CategoryId } from '@models/category.model';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { DIALOG_STATE } from '@shared/services/close-dialog/close-dialog.service';

export const TRANSACTION_FORM_NAMES = {
    TRANSACTION_DATE: 'transactionDate',
    MEMO: 'memo',
    AMOUNT: 'amount',
    STATUS: 'status',
    PAYEE: 'payee',
    CATEGORY: 'category',
    ACCOUNT_ID: 'accountId'
};

@Component({
    selector: 'app-transaction-dialog',
    templateUrl: './transaction-dialog.component.html',
    styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {

    public readonly DIALOG_STATE = DIALOG_STATE;

    public transactionForm: FormGroup;
    public dropdowns$;

    public saving = false;
    public transactions: CollectionResult<Transaction, TransactionId[]>;

    constructor(private dialogRef: MatDialogRef<TransactionDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private formBuilder: FormBuilder,
                private firestore: FirestoreService,
                private utility: UtilityService) {
    }

    ngOnInit() {

        this.transactions = this.firestore.getTransactions(this.data.budgetId);

        this.dropdowns$ = this.utility.combineLatestObj({
            payees: this.getPayees(),
            accounts: this.getAccounts(),
            groups: this.getGroups()
        });

        this.buildTransactionForm();
    }

    private getPayees() {
        return Observable.combineLatest(
            this.firestore.getPayees(this.data.budgetId).observable, payees => {
                return payees;
            });
    }

    private getAccounts() {
        return this.firestore.getAccounts(this.data.budgetId).observable;
    }

    private getGroups() {
        return this.firestore.getGroupsAndCategories(this.data.budgetId).map(x => x.data);
    }

    private buildTransactionForm() {

        const form = new Object();

        form[TRANSACTION_FORM_NAMES.TRANSACTION_DATE] = [this.data.transactionDate, Validators.required];
        form[TRANSACTION_FORM_NAMES.ACCOUNT_ID] = [this.data.accountId, Validators.required];
        form[TRANSACTION_FORM_NAMES.PAYEE] = [this.data.payee]; // Object set within autocomplete component
        form[TRANSACTION_FORM_NAMES.CATEGORY] = [null]; // Object set within autocomplete component
        form[TRANSACTION_FORM_NAMES.MEMO] = [this.data.memo];
        form[TRANSACTION_FORM_NAMES.AMOUNT] = [this.data.amount];
        form[TRANSACTION_FORM_NAMES.STATUS] = [this.data.status];

        this.transactionForm = this.formBuilder.group(form);
    }

    public saveChanges() {
        this.saving = true;
        this.saveTransaction();
    }

    private saveTransaction() {
        if (DIALOG_STATE.CREATE === this.data.state) {
            this.addNewTransaction();
        }
        else if (DIALOG_STATE.UPDATE === this.data.state) {
            this.updateTransaction();
        }
    }

    private addNewTransaction() {
        this.transactions.collection.add(this.transactionData);
        this.dialogRef.close();
    }

    private updateTransaction() {
        const transactionId = this.data.transactionId;
        this.transactions.collection.doc(transactionId).update(this.transactionData);

        this.dialogRef.close();
    }

    private get transactionData() {
        const dateFromForm = this.transactionForm.value.transactionDate;

        const getPayeeId = () => {
            // Type is any due to the field value can contain null, a string, or a PayeeId
            const payeeField: any = this.transactionForm.value.payee;

            if (payeeField && payeeField.payeeId) {
                return payeeField.payeeId;
            }
            else if (payeeField && payeeField.budgetAccountId) {
                return payeeField.budgetAccountId;
            }
            else if (payeeField && !payeeField.payeeId) {
                const newPayeeId = this.firestore.generateId();

                const payee: Payee = {
                    payeeName: payeeField,
                    belongToCategoryId: null
                };

                const payeeCollection: AngularFirestoreCollection<Payee> = this.firestore.getPayees(this.data.budgetId).collection;
                payeeCollection.doc(newPayeeId).set(payee);

                return newPayeeId;
            }
            else {
                return null;
            }
        };

        const getCategoryId = () => {
            const categoryField: CategoryId | null = this.transactionForm.value.category;

            if (categoryField) {
                return categoryField.categoryId;
            }
            else {
                return null;
            }
        };

        const data: Transaction = {
            transactionDate: this.transactionForm.value[TRANSACTION_FORM_NAMES.TRANSACTION_DATE],
            accountId: this.transactionForm.value[TRANSACTION_FORM_NAMES.ACCOUNT_ID],
            payeeId: getPayeeId(),
            categoryId: getCategoryId(),
            amount: this.transactionForm.value[TRANSACTION_FORM_NAMES.AMOUNT],
            memo: this.transactionForm.value[TRANSACTION_FORM_NAMES.MEMO],
            status: this.transactionForm.value[TRANSACTION_FORM_NAMES.STATUS]
        };

        return data;
    }


}
