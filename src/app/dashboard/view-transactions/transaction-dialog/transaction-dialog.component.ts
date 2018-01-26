import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Observable } from 'rxjs/Observable';
import { CollectionResult } from '@models/collection-result.model';
import { instanceOfTransaction, Transaction, TransactionId } from '@models/transaction.model';
import { instanceOfPayeeId, Payee, PayeeId } from '@models/payee.model';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { BudgetAccountId, instanceOfBudgetAccountId } from '@models/budget-account.model';
import { TransactionState } from '../shared/transaction_state.enum';
import { instanceOfTransfer } from '@models/transfer-transaction.model';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';
import { TransactionFormNames } from '../shared/transaction-form-names.enum';
import { EntityNames } from '@shared/enums/entity-names.enum';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { CategoryId, instanceOfCategoryId } from '@models/category.model';

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

        // TODO - add saving flag to all dialogs
        this.saving = true;

        // TODO - work on saving for transactions
        if (DialogState.Create === this.data.state) {
            this.createTransaction();
        }
        else if (DialogState.Update === this.data.state) {
            if (this.transactionStateChanged()) {
                this.removeReplacedEntity();
            }
            this.updateTransaction();
        }

        this.sendTransactionNotification();
        this.dialogRef.close();
    }

    private transactionStateChanged() {
        return this.initialTransactionState !== this.transactionState;
    }

    private get transactionState(): TransactionState {

        const entity: PayeeId | BudgetAccountId = this.transactionForm.value[TransactionFormNames.Payee];
        const isTransfer = () => instanceOfBudgetAccountId(entity);

        if (isTransfer()) {
            return TransactionState.Transfer;
        }
        else {
            return TransactionState.Standard;
        }
    }

    private createTransaction() {
        if (TransactionState.Standard === this.transactionState) {
            const transactions = this.getTransactionCollection();
            transactions.add(this.getTransactionData());
        }
        else if (TransactionState.Transfer === this.transactionState) {
            // TODO = add transfer
        }
    }

    private getTransactionCollection() {
        return this.firestore.getTransactions(this.data.budgetId).collection;
    }

    private updateTransaction() {
        if (TransactionState.Standard === this.transactionState) {
            const transactionId = this.data.transactionId;
            const transactions = this.getTransactionCollection();
            transactions.doc(transactionId).update(this.getTransactionData());
        }
        else if (TransactionState.Transfer === this.transactionState) {
            // TODO - add transfer
        }
    }

    private removeReplacedEntity() {

    }

    private getTransactionData() {
        const dateFromForm = this.transactionForm.value.TransactionDate;

        const getPayeeId = () => {

            // Payee field type meanings
            // ---------------------------
            // Payee type: regular transaction with a Payee that has previously been saved
            // budget account type: transfer transaction with an account that has previously been saved
            // string: regular transaction with a new Payee
            // null: Payee field was left empty

            const payeeField: PayeeId | BudgetAccountId | string | null = this.transactionForm.value[TransactionFormNames.Payee];

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
            const category: CategoryId | null = this.transactionForm.value[TransactionFormNames.Category];

            if (instanceOfCategoryId(category)) {
                return (<CategoryId>category).categoryId;
            }
            else {
                return null;
            }
        };

        return {
            transactionDate: this.transactionForm.value[TransactionFormNames.TransactionDate],
            accountId: this.transactionForm.value[TransactionFormNames.AccountId],
            payeeId: getPayeeId(),
            categoryId: getCategoryId(),
            amount: this.transactionForm.value[TransactionFormNames.Amount],
            memo: this.transactionForm.value[TransactionFormNames.Memo],
            status: this.transactionForm.value[TransactionFormNames.Status] || false
        };
    }

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
