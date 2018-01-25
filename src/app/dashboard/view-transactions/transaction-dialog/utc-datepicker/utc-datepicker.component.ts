import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '@shared/services/utility/utility.service';
import { TransactionFormNames } from '../../shared/transaction-form-names.enum';

@Component({
    selector: 'app-utc-datepicker',
    templateUrl: './utc-datepicker.component.html',
    styleUrls: ['./utc-datepicker.component.scss']
})
export class UtcDatepickerComponent implements OnInit, OnDestroy {

    public TransactionFormNames = TransactionFormNames;
    private utcDateForm: FormGroup;
    public localDateForm: FormGroup;

    @Input() transactionDate: Date;
    public dateWatcher;

    constructor(private controlContainer: ControlContainer,
                private utility: UtilityService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.utcDateForm = this.controlContainer.control as FormGroup;

        this.buildLocalDateForm();

        this.dateWatcher = this.localDateForm.get(TransactionFormNames.TransactionDate).valueChanges.subscribe(localDate => {
            if (localDate) {
                const utcDate = this.utility.convertToUtc(localDate);
                this.patchMasterForm(utcDate);
            }
            else {
                this.patchMasterForm(localDate);
            }
        });
    }

    ngOnDestroy() {
        this.dateWatcher.unsubscribe();
    }

    private patchMasterForm(date: Date) {
        this.utcDateForm.patchValue({
            transactionDate: date
        });
    }

    private buildLocalDateForm() {

        let localDate: Date;

        if (this.transactionDate) {
            localDate = this.utility.convertToLocal(this.transactionDate);
        }

        this.localDateForm = this.formBuilder.group({
            transactionDate: [localDate, Validators.required]
        });
    }
}
