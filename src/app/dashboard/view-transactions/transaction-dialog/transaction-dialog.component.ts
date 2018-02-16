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
    instanceOfReoccurringTransferTransactionId, instanceOfTransferTransactionId,
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
        console.log(`Initial state: ${this.initialTransactionState}`);

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

        if (isTransfer()) {
            return TransactionState.Transfer;
        }
        else {
            return TransactionState.Standard;
        }
    }

    private createTransaction() {

        if (TransactionState.Standard === this.transactionState) {

            if (this.isReoccurringTransaction()) {
                const reoccurringTransactions = this.getReoccurringTransactionCollection();
                reoccurringTransactions.add(this.getReoccurringTransactionData());
            }
            else {
                const transactions = this.getTransactionCollection();
                transactions.add(this.getTransactionData());
            }
        }
        else if (TransactionState.Transfer === this.transactionState) {

            if (this.isReoccurringTransaction()) {
                // add reoccurring transfer transaction
                console.log('Create reoccurring transfer transaction');
            }
            else {
                const transfers = this.getTransferCollection();
                transfers.add(this.getTransferData());
            }
        }
    }

    private updateTransaction() {
        if (TransactionState.Standard === this.transactionState) {

            if (this.isReoccurringTransaction()) {
                // update reoccurring standard transaction
                console.log('Create reoccurring standard transaction');
            }
            else {
                const transactions = this.getTransactionCollection();
                transactions.doc(this.data.transactionId).update(this.getTransactionData());
            }
        }
        else if (TransactionState.Transfer === this.transactionState) {
            if (this.isReoccurringTransaction()) {
                // update reoccurring transfer transaction
                console.log('Update reoccurring transfer transaction');
            }
            else {
                const transfers = this.getTransferCollection();
                transfers.doc(this.data.transferTransactionId).update(this.getTransferData());
            }
        }
    }

    private isReoccurringTransaction() {
        return this.transactionForm.value[TransactionFormNames.ReoccurringSchedule] !== null;
    }

    private getTransactionCollection() {
        return this.references.getTransactionCollectionRef(this.data.budgetId);
    }

    private getReoccurringTransactionCollection() {
        return this.references.getReoccurringTransactionCollectionRef(this.data.budgetId);
    }

    private deleteReplacedEntity() {
        if (this.TransactionState.Standard === this.initialTransactionState) {
            const transactions = this.getTransactionCollection();
            transactions.doc(this.data.transactionId).delete();
        }
        else if (this.TransactionState.Transfer === this.initialTransactionState) {
            const transfers = this.getTransferCollection();
            transfers.doc(this.data.transferTransactionId).delete();
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
            cleared: this.transactionForm.value[TransactionFormNames.Cleared] || false,
            locked: this.data.locked || false
        };
    }

    private getTransferData(): TransferTransaction {
        return {
            transactionDate: this.transactionForm.value[TransactionFormNames.TransactionDate],
            originAccountId: this.transactionForm.value[TransactionFormNames.AccountId],
            destinationAccountId: this.getPayeeId(),
            amount: this.transactionForm.value[TransactionFormNames.Amount],
            memo: this.transactionForm.value[TransactionFormNames.Memo],
            clearedOrigin: this.transactionForm.value[TransactionFormNames.Cleared] || false,
            clearedDestination: this.transactionForm.value[TransactionFormNames.Cleared] || false,
            lockedOrigin: this.data.lockedOrigin || false,
            lockedDestination: this.data.lockedDestination || false
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
        return this.references.getTransfers(this.data.budgetId);
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
}
