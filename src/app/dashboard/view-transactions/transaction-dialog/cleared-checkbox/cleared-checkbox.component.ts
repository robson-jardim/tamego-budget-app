import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ControlContainer } from '@angular/forms';
import { TransactionFormNames } from '../../shared/transaction-form-names.enum';

@Component({
    selector: 'app-cleared-checkbox',
    templateUrl: './cleared-checkbox.component.html',
    styleUrls: ['./cleared-checkbox.component.scss']
})
export class ClearedCheckboxComponent implements OnInit {

    @Input() transactionForm: FormGroup;
    public TransactionFormNames = TransactionFormNames;

    // TODO - make indeterminate checkbox
    public checked = false;
    public indeterminate = false;

    constructor() {
    }

    ngOnInit() {
    }

}
