import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { UtilityService } from '@shared/services/utility/utility.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/mergeMap';
import { CollectionResult } from '@models/collection-result.model';
import { Transaction, TransactionId } from '@models/transaction.model';
import { Payee } from '@models/payee.model';
import { CategoryId } from '@models/category.model';
import { AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
    selector: 'app-transaction-dialog',
    templateUrl: './transaction-dialog.component.html',
    styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {

    public transactionForm: FormGroup;
    public dropdowns$;
    private isTransfer: boolean;
    public saving = false;
    public transactions: CollectionResult<Transaction, TransactionId[]>;

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

        const baseForm: any = {
            transactionDate: [this.data.transactionDate, Validators.required],
            memo: [this.data.memo],
            amount: [this.data.amount],
            status: [this.data.status || false]
        };

        if (this.isTransfer) {
            console.log('Is transfer');
        }
        else {
            baseForm.accountId = [this.data.accountId, Validators.required];
            baseForm.payee = [null]; // Object set within autocomplete component
            baseForm.category = [null]; // Object set within autocomplete component
        }

        this.transactionForm = this.formBuilder.group(baseForm);
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
        this.transactions.collection.add(this.transactionData);
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
            transactionDate: this.transactionForm.value.transactionDate,
            accountId: this.transactionForm.value.accountId,
            payeeId: getPayeeId(),
            categoryId: getCategoryId(),
            amount: this.transactionForm.value.amount,
            memo: this.transactionForm.value.memo,
            status: this.transactionForm.value.status
        };

        return data;
    }


}
