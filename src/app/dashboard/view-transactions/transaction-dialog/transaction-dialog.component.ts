import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { DateConverterService } from '@shared/services/date-converter/date-converter.service';
import { BudgetAccount, BudgetAccountId } from '@models/budget-account.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/mergeMap';
import { CollectionResult } from '@models/collection-result.model';
import { Transaction, TransactionId } from '@models/transaction.model';
import { PayeeId } from '@models/payee.model';


@Component({
    selector: 'app-transaction-dialog',
    templateUrl: './transaction-dialog.component.html',
    styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {

    public payees$;

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
                private utility: DateConverterService) {
    }

    ngOnInit() {

        if (this.data.transferTransactionId) {
            this.setToTransferState();
        }

        this.accounts = this.firestore.getAccounts(this.data.budgetId);
        this.groupsAndCategories = this.firestore.getGroupsAndCategories(this.data.budgetId);
        this.transactions = this.firestore.getTransactions(this.data.budgetId, this.data.accountId);
        this.payees$ = this.getPayees();

        this.buildTransactionForm();

        // this.transactionForm.get('payeeId').valueChanges
        //     .startWith(null)
        //     .mergeMap(input => {
        //         if (input) {
        //             return this.filterPayees(input);
        //         }
        //         else {
        //             return Observable.of([]);
        //         }
        //     })
        //     .subscribe();
        // .subscribe(x => console.log(x));
    }

    public filterPayees(textField: string) {
        return this.getPayees().map(payees => {
            console.log(textField);
            return payees.filter(payee => {
                return payee.payeeName.toLowerCase().indexOf(textField.toLowerCase()) === 0;
            });
        });
    }

    public getPayees() {
        return this.firestore.getPayees(this.data.budgetId).observable;
    }

    private buildTransactionForm() {

        const baseForm: any = {
            transactionDate: [this.utility.convertToLocal(this.data.transactionDate), Validators.required],
            memo: [this.data.memo],
            amount: [this.data.amount],
            status: [this.data.status]
        };

        if (this.isTransfer) {
            console.log('Is transfer');
        }
        else {
            baseForm.accountId = [this.data.accountId, Validators.required];
            baseForm.payeeId = [this.data.payeeId];
            baseForm.categoryId = [this.data.categoryId];
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
        const utcDate = this.utility.convertToUtc(dateFromForm);

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

    public displayPayeeName(payee: PayeeId) {

        if (payee && payee.payeeName) {
            return payee.payeeName;
        }
        return payee;

        // this.payees.subscribe(x => console.log(x))
        // this.payees.filter((p: PayeeId) => {
        //     if (payee.payeeId === p.payeeId) {
        //         console.log('here');
        //         return p.payeeName;
        //     }
        // }).subscribe();
    }



}
