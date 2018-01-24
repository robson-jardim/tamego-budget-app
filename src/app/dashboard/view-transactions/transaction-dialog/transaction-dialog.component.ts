import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Observable } from 'rxjs/Observable';
import { CollectionResult } from '@models/collection-result.model';
import { Transaction, TransactionId } from '@models/transaction.model';
import { instanceOfPayeeId, Payee, PayeeId } from '@models/payee.model';
import { DIALOG_STATE } from '@shared/services/close-dialog/close-dialog.service';
import { CategoryId, instanceOfCategoryId } from '@models/category.model';
import { BudgetAccountId, instanceOfBudgetAccountId } from '@models/budget-account.model';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { TRANSACTION_FORM_NAMES } from '../shared/transaction-form-names';
import { INITIAL_TRANSACTION_STATE } from '../shared/initial_transaction_state.enum';

@Component({
    selector: 'app-transaction-dialog',
    templateUrl: './transaction-dialog.component.html',
    styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {

    public transactionForm: FormGroup;
    public dropdowns$;
    public readonly DIALOG_STATE = DIALOG_STATE;

    public saving = false;
    private transactions: CollectionResult<Transaction, TransactionId[]>;
    private initialTransactionState: INITIAL_TRANSACTION_STATE;

    constructor(private dialogRef: MatDialogRef<TransactionDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private formBuilder: FormBuilder,
                private firestore: FirestoreService,
                private utility: UtilityService) {
    }

    ngOnInit() {

        this.setInitialTransactionState();

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

            // Payee field type meanings
            // ---------------------------
            // payee type: regular transaction with a payee that has previously been saved
            // budget account type: transfer transaction with an account that has previously been saved
            // string: regular transaction with a new payee
            // null: payee field was left empty

            const payeeField: PayeeId | BudgetAccountId | string | null = this.transactionForm.value[TRANSACTION_FORM_NAMES.PAYEE];

            if (!payeeField) {
                return null;
            }
            else if (instanceOfPayeeId(payeeField)) {
                return (<PayeeId>payeeField).payeeId;
            }
            else if (instanceOfBudgetAccountId(payeeField)) {
                return (<BudgetAccountId>payeeField).budgetAccountId;
            }
            else {
                // Unsaved payeeId
                const newPayeeId = this.firestore.generateId();

                const newPayee: Payee = {
                    payeeName: <string>payeeField,
                    belongToCategoryId: null
                };

                const payeeCollection: AngularFirestoreCollection<Payee> = this.firestore.getPayees(this.data.budgetId).collection;
                payeeCollection.doc(newPayeeId).set(newPayee);

                return newPayeeId;
            }
        };

        const getCategoryId = () => {
            const category: CategoryId | null = this.transactionForm.value[TRANSACTION_FORM_NAMES.CATEGORY];

            if (instanceOfCategoryId(category)) {
                return (<CategoryId>category).categoryId;
            }
            else {
                return null;
            }
        };

        return {
            transactionDate: this.transactionForm.value[TRANSACTION_FORM_NAMES.TRANSACTION_DATE],
            accountId: this.transactionForm.value[TRANSACTION_FORM_NAMES.ACCOUNT_ID],
            payeeId: getPayeeId(),
            categoryId: getCategoryId(),
            amount: this.transactionForm.value[TRANSACTION_FORM_NAMES.AMOUNT],
            memo: this.transactionForm.value[TRANSACTION_FORM_NAMES.MEMO],
            status: this.transactionForm.value[TRANSACTION_FORM_NAMES.STATUS]
        };
    }

    private setInitialTransactionState() {
        // TODO - set transaction state
    }
}
