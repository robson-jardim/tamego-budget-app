import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../../shared/services/firestore/firestore.service';
import { DateConverterService } from '../../../../shared/services/dialog/date.service';
import { Transaction } from '../../../../../models/transaction.model';

@Component({
    selector: 'app-transaction-dialog',
    templateUrl: './transaction-dialog.component.html',
    styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {

    public saving = false;
    public mode;
    public transactionForm: FormGroup;

    public accounts;
    public groups;
    public transactions;

    constructor(private dialogRef: MatDialogRef<TransactionDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private formBuilder: FormBuilder,
                private firestore: FirestoreService,
                private dateConverter: DateConverterService) {
        this.transactions = this.firestore.getTransactions('aqvJ4oQo0E5ldQRdsxsR', 'xPVl5jgXLPLC52T1Lh3C');

        this.mode = this.data.mode;
    }

    ngOnInit() {
        this.buildTransactionForm();
        this.accounts = this.firestore.getAccounts('aqvJ4oQo0E5ldQRdsxsR');
        this.groups = this.firestore.getGroupsAndCategories('aqvJ4oQo0E5ldQRdsxsR');
    }

    private buildTransactionForm() {
        this.transactionForm = this.formBuilder.group({
            accountId: [null, Validators.required],
            transactionDate: ['', Validators.required],
            payeeId: [null],
            categoryId: [null],
            memo: [null],
            amount: [null]
        });
    }

    public saveChanges() {

        const date = this.transactionForm.value.transactionDate;

        this.saving = true;

        if (this.mode === 'CREATE') {
            this.addNewTransaction();
        }
        else if (this.mode === 'UPDATE') {

        }
    }

    private addNewTransaction() {

        const dateFromForm = this.transactionForm.value.transactionDate;
        const utcDate = this.dateConverter.convertToUTC(dateFromForm);

        const data: Transaction = {
            transactionDate: utcDate,
            accountId: this.transactionForm.value.accountId,
            payeeId: this.transactionForm.value.payeeId,
            categoryId: this.transactionForm.value.categoryId,
            amount: this.transactionForm.value.amount,
            memo: this.transactionForm.value.memo,
            status: 0
        };

        this.transactions.collection.add(data);
        this.dialogRef.close();
    }
}
