import { Component, OnInit } from '@angular/core';
import { FormGroup, ControlContainer } from '@angular/forms';

@Component({
    selector: 'app-cleared-checkbox',
    templateUrl: './cleared-checkbox.component.html',
    styleUrls: ['./cleared-checkbox.component.scss']
})
export class ClearedCheckboxComponent implements OnInit {

    public transactionForm: FormGroup;

    public checked = false;
    public indeterminate = false;

    constructor(private controlContainer: ControlContainer) {
    }

    ngOnInit() {
        this.transactionForm = this.controlContainer.control as FormGroup;
    }

}
