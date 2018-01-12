import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../../shared/services/firestore/firestore.service';
import { UtilityService } from '../../../../shared/services/date-converter/date-converter.service';
import { Transaction, TransactionId } from '../../../../../models/transaction.model';
import { CollectionResult } from '../../../../../models/collection-result.model';
import { BudgetAccount, BudgetAccountId } from '../../../../../models/budget-account.model';

@Component({
    selector: 'app-transaction-dialog',
    templateUrl: './transaction-dialog.component.html',
    styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {
    payees: any;

    public saving = false;
    public transactionForm: FormGroup;

    public transactions: CollectionResult<Transaction, TransactionId[]>;
    public accounts: CollectionResult<BudgetAccount, BudgetAccountId[]>;
    public groupsAndCategories: any;
    private isTransfer: boolean;

    constructor(private dialogRef: MatDialogRef<TransactionDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private formBuilder: FormBuilder,
                private firestore: FirestoreService,
                private utility: UtilityService) {
    }

    ngOnInit() {

        if (this.data.transferTransactionId) {
            this.setToTransferState();
        }

        this.accounts = this.firestore.getAccounts(this.data.budgetId);
        this.groupsAndCategories = this.firestore.getGroupsAndCategories(this.data.budgetId);
        this.transactions = this.firestore.getTransactions(this.data.budgetId, this.data.accountId);
        this.payees = this.firestore.getPayees(this.data.budgetId);

        this.buildTransactionForm();
    }

    private buildTransactionForm() {

        if (this.isTransfer) {
            if (this.data.originAccountId === this.data.accountId) {
                this.transactionForm = this.formBuilder.group({
                    accountId: [this.data.originAccountId, Validators.required],
                    transactionDate: [this.data.transactionDate, Validators.required],
                    payeeId: [this.data.destinationAccountId],
                    categoryId: [this.data.categoryId],
                    memo: [this.data.memo],
                    amount: [this.data.amount],
                    status: [this.data.status]
                });
            } else {
                this.transactionForm = this.formBuilder.group({
                    accountId: [this.data.destinationAccountId, Validators.required],
                    transactionDate: [this.data.transactionDate, Validators.required],
                    payeeId: [this.data.originAccountId],
                    categoryId: [this.data.categoryId],
                    memo: [this.data.memo],
                    amount: [this.data.amount],
                    status: [this.data.status]
                });
            }
        }
        else {
            this.transactionForm = this.formBuilder.group({
                accountId: [this.data.accountId, Validators.required],
                transactionDate: [this.data.transactionDate, Validators.required],
                payeeId: [this.data.payeeId],
                categoryId: [this.data.categoryId],
                memo: [this.data.memo],
                amount: [this.data.amount],
                status: [this.data.status]
            });
        }
    }

    public saveChanges() {

        this.saving = true;

        if (this.isTransfer) {
            this.saveTransfer();
        }
        else {
            this.saveTransaction();
        }

    }

    private addNewTransaction() {
        this.transactions.collection.add(this.transactionFormData);
        this.dialogRef.close();
    }

    public setToTransferState() {
        this.isTransfer = true;
    }

    public setToTransactionState() {
        this.isTransfer = false;
    }

    private saveTransfer() {

        if (this.data.state === 'CREATE') {
            console.log('save transfer');
            this.addNewTransaction();
        }
        else if (this.data.state === 'UPDATE') {
            console.log('update transfer');
        }

    }

    private saveTransaction() {
        if (this.data.state === 'CREATE') {
            this.addNewTransaction();
        }
        else if (this.data.state === 'UPDATE') {
            this.updateTransaction();
        }
    }

    private updateTransaction() {
        const transactionId = this.data.transactionId;
        this.transactions.collection.doc(transactionId).update(this.transactionFormData);

        this.dialogRef.close();
    }

    private get transactionFormData() {
        const dateFromForm = this.transactionForm.value.transactionDate;
        const utcDate = this.utility.convertToUTC(dateFromForm);

        const data: Transaction = {
            transactionDate: utcDate,
            accountId: this.transactionForm.value.accountId,
            payeeId: this.transactionForm.value.payeeId,
            categoryId: this.transactionForm.value.categoryId,
            amount: this.transactionForm.value.amount,
            memo: this.transactionForm.value.memo,
            status: this.transactionForm.value.status
        };

        return data;
    }


}
