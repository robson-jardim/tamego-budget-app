import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';

@Component({
    selector: 'app-transaction-dialog',
    templateUrl: './transaction-dialog.component.html',
    styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {

    public saving = false;
    public mode;
    private transactionForm: FormGroup;

    public accounts;
    public groups;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private formBuilder: FormBuilder,
                private firestore: FirestoreService) {
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
        this.saving = true;

        if (this.mode === 'CREATE') {

        }
        else if (this.mode === 'UPDATE') {

        }
    }
}
