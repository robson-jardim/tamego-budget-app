import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Observable } from 'rxjs/Observable';
import {
    instanceOfReoccurringTransactionId, instanceOfTransactionId, ReoccurringTransaction,
    Transaction
} from '@models/transaction.model';
import { instanceOfPayeeId, Payee, PayeeId } from '@models/payee.model';
import { DialogState } from '@shared/services/close-dialog/close-dialog.service';
import { BudgetAccountId, instanceOfBudgetAccountId } from '@models/budget-account.model';
import { TransactionState } from '../shared/transaction_state.enum';
import {
    instanceOfReoccurringTransferTransactionId, instanceOfTransferTransactionId, ReoccurringTransferTransaction,
    TransferTransaction
} from '@models/transfer-transaction.model';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';
import { TransactionFormNames } from '../shared/transaction-form-names.enum';
import { EntityNames } from '@shared/enums/entity-names.enum';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { CategoryId, instanceOfCategoryId } from '@models/category.model';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';

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
    public TransactionState = TransactionState;

    public saving = false;
    private initialTransactionState: TransactionState;

    constructor(private dialogRef: MatDialogRef<TransactionDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private formBuilder: FormBuilder,
                private firestore: FirestoreService,
                private utility: UtilityService,
                private notifications: GeneralNotificationsService,
                private references: FirestoreReferenceService) {
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

        // TODO - set length of memo to be 250 characters

        form[TransactionFormNames.TransactionDate] = [this.data.transactionDate, Validators.required];
        form[TransactionFormNames.AccountId] = [this.data.accountId || this.data.originAccountId, Validators.required];
        form[TransactionFormNames.Payee] = [null]; // Object set within autocomplete component
        form[TransactionFormNames.Category] = [null]; // Object set within autocomplete component
        form[TransactionFormNames.Memo] = [this.data.memo];
        form[TransactionFormNames.Amount] = [this.data.amount];
        form[TransactionFormNames.Cleared] = [this.data.cleared];
        form[TransactionFormNames.ReoccurringSchedule] = [this.data.reoccurringSchedule];

        this.transactionForm = this.formBuilder.group(form);
    }

    public saveChanges() {

        this.saving = true;

        if (DialogState.Create === this.data.state) {
            this.createTransaction();
        }
        else if (DialogState.Update === this.data.state) {
            if (this.transactionStateChanged()) {
                this.deleteReplacedEntity();
                this.createTransaction();
            }
            else {
                this.updateTransaction();
            }
        }
        else {
            this.notifications.sendErrorNotification();
            throw new Error('Unable to determine dialog state');
        }

        this.sendTransactionNotification();
        this.dialogRef.close();
    }

    private transactionStateChanged() {
        return this.initialTransactionState !== this.transactionState;
    }

    public get transactionState(): TransactionState {

        const entity: PayeeId | BudgetAccountId = this.transactionForm.value[TransactionFormNames.Payee];
        const isTransfer = () => instanceOfBudgetAccountId(entity);
        const isReoccurring = () => this.isReoccurringTransaction();


        if (isTransfer()) {
            if (isReoccurring()) {
                return TransactionState.ReoccurringTransfer;
            }
            else {
                return TransactionState.Transfer;
            }
        }
        else {
            if (isReoccurring()) {
                return TransactionState.ReoccurringStandard;
            }
            else {
                return TransactionState.Standard;
            }
        }
    }

    private createTransaction() {
        if (TransactionState.Standard === this.transactionState) {
            const transactions = this.getTransactionCollection();
            transactions.add(this.getTransactionData());
        }
        else if (TransactionState.ReoccurringStandard === this.transactionState) {
            const reoccurringTransactions = this.getReoccurringTransactionCollection();
            reoccurringTransactions.add(this.getReoccurringTransactionData());
        }
        else if (this.TransactionState.Transfer === this.transactionState) {
            const transfers = this.getTransferCollection();
            transfers.add(this.getTransferData());
        }
        else if (TransactionState.ReoccurringTransfer === this.transactionState) {
            const reoccurringTransferTransactions = this.getReoccurringTransferTransactionCollection();
            reoccurringTransferTransactions.add(this.getReoccurringTransferTransactionData());
        }
        else {
            this.notifications.sendErrorNotification();
            throw new Error('Unable to determine transaction state');
        }
    }

    private updateTransaction() {
        if (TransactionState.Standard === this.transactionState) {
            const transactions = this.getTransactionCollection();
            transactions.doc(this.data.transactionId).update(this.getTransactionData());
        }
        else if (TransactionState.ReoccurringStandard === this.transactionState) {
            const reoccurringTransactions = this.getReoccurringTransactionCollection();
            reoccurringTransactions.doc(this.data.reoccurringTransactionId).update(this.getReoccurringTransactionData());
        }
        else if (TransactionState.Transfer === this.transactionState) {
            const transfers = this.getTransferCollection();
            transfers.doc(this.data.transferTransactionId).update(this.getTransferData());
        }
        else if (TransactionState.ReoccurringTransfer === this.transactionState) {
            const reoccurringTransfers = this.getReoccurringTransferTransactionCollection();
            reoccurringTransfers.doc(this.data.reoccurringTransferTransactionId).update(this.getReoccurringTransferTransactionData());
        }
        else {
            this.notifications.sendErrorNotification();
            throw new Error('Unable to determine transaction state');
        }
    }

    private isReoccurringTransaction() {
        if (this.transactionForm.value[TransactionFormNames.ReoccurringSchedule]) {
            return true;
        }
        else {
            return false;
        }
    }

    private getTransactionCollection() {
        return this.references.getTransactionCollectionRef(this.data.budgetId);
    }

    private getReoccurringTransactionCollection() {
        return this.references.getReoccurringTransactionCollectionRef(this.data.budgetId);
    }

    private deleteReplacedEntity() {
        if (TransactionState.Standard === this.initialTransactionState) {
            const transactions = this.getTransactionCollection();
            transactions.doc(this.data.transactionId).delete();
        }
        else if (this.TransactionState.ReoccurringStandard === this.initialTransactionState) {
            const reoccurringTransactions = this.getReoccurringTransactionCollection();
            reoccurringTransactions.doc(this.data.reoccurringTransactionId).delete();
        }
        else if (TransactionState.Transfer === this.initialTransactionState) {
            const transfers = this.getTransferCollection();
            transfers.doc(this.data.transferTransactionId).delete();
        }
        else if (this.TransactionState.ReoccurringTransfer === this.initialTransactionState) {
            const reoccurringTransfers = this.getReoccurringTransferTransactionCollection();
            reoccurringTransfers.doc(this.data.reoccurringTransferTransactionId).delete();
        }
        else {
            this.notifications.sendErrorNotification();
            throw new Error('Unable to determine initial transaction state');
        }
    }

    private readonly getPayeeId = () => {

        // Payee field type meanings
        // ---------------------------
        // Payee type: regular transaction with a Payee that has previously been saved
        // budget account type: transfer transaction with an account that has previously been saved
        // string: regular transaction with a new Payee
        // null: Payee field was left empty

        const payeeField: PayeeId | BudgetAccountId | string | null = this.transactionForm.value[TransactionFormNames.Payee];

        if (instanceOfPayeeId(payeeField)) {
            return (<PayeeId>payeeField).payeeId;
        }
        else if (instanceOfBudgetAccountId(payeeField)) {
            return (<BudgetAccountId>payeeField).budgetAccountId;
        }
        else if (typeof payeeField === 'string') {
            const newPayeeId = this.firestore.generateId();

            const newPayee: Payee = {
                payeeName: <string>payeeField,
                belongToCategoryId: null
            };

            const payeeCollection: AngularFirestoreCollection<Payee> = this.firestore.getPayees(this.data.budgetId).collection;
            payeeCollection.doc(newPayeeId).set(newPayee);

            return newPayeeId;
        }
        else {
            return null;
        }
    };

    private readonly getCategoryId = () => {
        const category: CategoryId | null = this.transactionForm.value[TransactionFormNames.Category];

        if (instanceOfCategoryId(category)) {
            return (<CategoryId>category).categoryId;
        }
        else {
            return null;
        }
    };

    private getTransactionData(): Transaction {
        return {
            transactionDate: this.transactionForm.value[TransactionFormNames.TransactionDate],
            accountId: this.transactionForm.value[TransactionFormNames.AccountId],
            payeeId: this.getPayeeId(),
            categoryId: this.getCategoryId(),
            amount: this.transactionForm.value[TransactionFormNames.Amount],
            splits: [],
            memo: this.transactionForm.value[TransactionFormNames.Memo],
            cleared: this.transactionForm.value[TransactionFormNames.Cleared] || false, // Default value is false
            locked: this.data.locked || false // Keep original value, otherwise false if changing from transfer to transaction
        };
    }

    private getTransferData(): TransferTransaction {
        return {
            transactionDate: this.transactionForm.value[TransactionFormNames.TransactionDate],
            originAccountId: this.transactionForm.value[TransactionFormNames.AccountId],
            destinationAccountId: this.getPayeeId(),
            amount: this.transactionForm.value[TransactionFormNames.Amount],
            memo: this.transactionForm.value[TransactionFormNames.Memo],
            clearedOrigin: this.transactionForm.value[TransactionFormNames.Cleared] || false, // Default value is false
            clearedDestination: this.transactionForm.value[TransactionFormNames.Cleared] || false, // Default value is false
            lockedOrigin: this.data.lockedOrigin || false, // Keep original value, otherwise false if changing from transaction to transfer
            lockedDestination: this.data.lockedDestination || false // Keep original value, otherwise false if changing from transaction to transfer
        };
    }

    private setInitialTransactionState() {

        if (instanceOfTransferTransactionId(this.data)) {
            this.initialTransactionState = TransactionState.Transfer;
        }
        else if (instanceOfTransactionId(this.data)) {
            this.initialTransactionState = TransactionState.Standard;
        }
        else if (instanceOfReoccurringTransactionId(this.data)) {
            this.initialTransactionState = TransactionState.ReoccurringStandard;
        }
        else if (instanceOfReoccurringTransferTransactionId(this.data)) {
            this.initialTransactionState = TransactionState.ReoccurringTransfer;
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

    private getTransferCollection() {
        return this.references.getTransferTransactionCollectionRef(this.data.budgetId);
    }

    public isAccountSelectedAsDestination(account: BudgetAccountId) {

        let payee: BudgetAccountId | PayeeId | string = this.transactionForm.controls[TransactionFormNames.Payee].value;

        if (!instanceOfBudgetAccountId(payee)) {
            return false;
        }

        payee = payee as BudgetAccountId;
        return payee.budgetAccountId === account.budgetAccountId;
    }

    private getReoccurringTransactionData(): ReoccurringTransaction {
        const transactionData: Transaction = this.getTransactionData();
        return {
            reoccurringSchedule: this.transactionForm.controls[TransactionFormNames.ReoccurringSchedule].value,
            ...transactionData,
        };
    }

    private getReoccurringTransferTransactionData(): ReoccurringTransferTransaction {
        const transferData: TransferTransaction = this.getTransferData();

        return {
            reoccurringSchedule: this.transactionForm.controls[TransactionFormNames.ReoccurringSchedule].value,
            ...transferData,
        };
    }

    private getReoccurringTransferTransactionCollection() {
        return this.references.getReoccurringTransferTransactionCollectionRef(this.data.budgetId);
    }
}
