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


    change() {
        if (!this.indeterminate && !this.checked) {
            console.log('first');
            this.indeterminate = true;
            this.checked = false;
        }
        else if (this.indeterminate && !this.checked) {
            console.log('second');
            this.checked = true;
            this.indeterminate = false;
        }
        else {
            console.log('clear');
            this.indeterminate = false;
            this.checked = false;
        }

    }

    interChange() {
        console.log('inter');
    }

}
