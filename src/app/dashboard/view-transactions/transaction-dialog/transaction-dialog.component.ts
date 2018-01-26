import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Observable } from 'rxjs/Observable';
import { CollectionResult } from '@models/collection-result.model';
import { Transaction, TransactionId } from '@models/transaction.model';
import { PayeeId } from '@models/payee.model';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { BudgetAccountId, instanceOfBudgetAccountId } from '@models/budget-account.model';
import { TransactionState } from '../shared/transaction_state.enum';
import { instanceOfTransfer } from '@models/transfer-transaction.model';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';
import { TransactionFormNames } from '../shared/transaction-form-names.enum';
import { EntityNames } from '@shared/enums/entity-names.enum';

@Component({
    selector: 'app-transaction-dialog',
    templateUrl: './transaction-dialog.component.html',
    styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {

    public transactionForm: FormGroup;
    public dropdowns$;
    public DialogState = DialogState;
    public TransactionFormNames = TransactionFormNames;

    public saving = false;
    private transactions: CollectionResult<Transaction, TransactionId[]>;
    private initialTransactionState: TransactionState;

    constructor(private dialogRef: MatDialogRef<TransactionDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private formBuilder: FormBuilder,
                private firestore: FirestoreService,
                private utility: UtilityService,
                private notifications: GeneralNotificationsService) {
    }

    ngOnInit() {
        this.setInitialTransactionState();
        this.buildTransactionForm();

        this.dropdowns$ = this.utility.combineLatestObj({
            payees: this.getPayees(),
            accounts: this.getAccounts(),
            groups: this.getGroups()
        });

        this.transactions = this.firestore.getTransactions(this.data.budgetId);
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

        form[TransactionFormNames.TransactionDate] = [this.data.transactionDate, Validators.required];
        form[TransactionFormNames.AccountId] = [this.data.accountId || this.data.originAccountId, Validators.required];
        form[TransactionFormNames.Payee] = [null]; // Object set within autocomplete component
        form[TransactionFormNames.Category] = [null]; // Object set within autocomplete component
        form[TransactionFormNames.Memo] = [this.data.memo];
        form[TransactionFormNames.Amount] = [this.data.amount];
        form[TransactionFormNames.Status] = [this.data.status];

        this.transactionForm = this.formBuilder.group(form);
    }

    public saveChanges() {
        this.saving = true;

        if (DialogState.Create === this.data.state) {

            this.sendTransactionNotification();
        }
        else if (DialogState.Update === this.data.state) {

            this.sendTransactionNotification();
        }
        // TODO - work on saving for transactions

        // only matters in the context of update
        // if (this.transactionStateChanged()) {
        //     if (TransactionState.Transfer === this.initialTransactionState) {
        //         // remove transfer
        //     }
        //     else {
        //         // remove transaction
        //     }
        // }
        //
        // if (TransactionState.Transfer === this.transactionState) {
        //     console.log('Saving transfer');
        // }
        // else {
        //     this.saveTransaction();
        //     console.log('Saving transaction');
        // }

    }

    private transactionStateChanged() {
        return this.initialTransactionState !== this.transactionState;
    }

    private get transactionState(): TransactionState {

        const isTransfer = () => {
            const entity: PayeeId | BudgetAccountId = this.transactionForm.value[TransactionFormNames.Payee];
            return instanceOfBudgetAccountId(entity);
        };

        if (isTransfer()) {
            return TransactionState.Transfer;
        }
        else {
            return TransactionState.Standard;
        }
    }

    // private saveTransaction() {
    //     if (DialogState.Create === this.data.state) {
    //         this.addNewTransaction();
    //     }
    //     else if (DialogState.Update === this.data.state) {
    //         this.updateTransaction();
    //     }
    // }
    //
    // private addNewTransaction() {
    //     this.transactions.collection.add(this.transactionData);
    //     this.dialogRef.close();
    // }
    //
    // private updateTransaction() {
    //     const transactionId = this.data.transactionId;
    //     this.transactions.collection.doc(transactionId).update(this.transactionData);
    //
    //     this.dialogRef.close();
    // }
    //
    // private get transactionData() {
    //     const dateFromForm = this.transactionForm.value.TransactionDate;
    //
    //     const getPayeeId = () => {
    //
    //         // Payee field type meanings
    //         // ---------------------------
    //         // Payee type: regular transaction with a Payee that has previously been saved
    //         // budget account type: transfer transaction with an account that has previously been saved
    //         // string: regular transaction with a new Payee
    //         // null: Payee field was left empty
    //
    //         const payeeField: PayeeId | BudgetAccountId | string | null = this.transactionForm.value[TransactionFormNames.Payee];
    //
    //         if (!payeeField) {
    //             return null;
    //         }
    //         else if (instanceOfPayeeId(payeeField)) {
    //             return (<PayeeId>payeeField).payeeId;
    //         }
    //         else if (instanceOfBudgetAccountId(payeeField)) {
    //             return (<BudgetAccountId>payeeField).budgetAccountId;
    //         }
    //         else {
    //             // Unsaved payeeId
    //             const newPayeeId = this.firestore.generateId();
    //
    //             const newPayee: Payee = {
    //                 payeeName: <string>payeeField,
    //                 belongToCategoryId: null
    //             };
    //
    //             const payeeCollection: AngularFirestoreCollection<Payee> = this.firestore.getPayees(this.data.budgetId).collection;
    //             payeeCollection.doc(newPayeeId).set(newPayee);
    //
    //             return newPayeeId;
    //         }
    //     };
    //
    //     const getCategoryId = () => {
    //         const category: CategoryId | null = this.transactionForm.value[TransactionFormNames.Category];
    //
    //         if (instanceOfCategoryId(category)) {
    //             return (<CategoryId>category).categoryId;
    //         }
    //         else {
    //             return null;
    //         }
    //     };
    //
    //     return {
    //         transactionDate: this.transactionForm.value[TransactionFormNames.TransactionDate],
    //         accountId: this.transactionForm.value[TransactionFormNames.AccountId],
    //         payeeId: getPayeeId(),
    //         categoryId: getCategoryId(),
    //         amount: this.transactionForm.value[TransactionFormNames.Amount],
    //         memo: this.transactionForm.value[TransactionFormNames.Memo],
    //         status: this.transactionForm.value[TransactionFormNames.Status]
    //     };
    // }

    private setInitialTransactionState() {

        if (instanceOfTransfer(this.data)) {
            this.initialTransactionState = TransactionState.Transfer;
        }
        else {
            this.initialTransactionState = TransactionState.Standard;
        }
    }

    private sendTransactionNotification() {
        if (DialogState.Create === this.data.state) {
            this.notifications.sendCreateNotification(EntityNames.Transaction);
        }
        else if (DialogState.Update === this.data.state) {
            this.notifications.sendUpdateNotification(EntityNames.Transaction);
        }
        else if (DialogState.Delete === this.data.state) {
            this.notifications.sendDeleteNotification(EntityNames.Transaction);
        }
    }
}
