import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TransactionFormNames } from '../../shared/transaction-form-names.enum';
import { FormGroup } from '@angular/forms';
import { filter, map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-cleared-checkbox',
    templateUrl: './cleared-checkbox.component.html',
    styleUrls: ['./cleared-checkbox.component.scss']
})
export class ClearedCheckboxComponent implements OnInit, OnDestroy {

    @Input() transactionForm: FormGroup;
    public TransactionFormNames = TransactionFormNames;
    private checkboxSubscription: Subscription;

    constructor() {
    }

    ngOnInit() {

        const reoccurringSchedule = this.transactionForm.controls[TransactionFormNames.ReoccurringSchedule].value;

        if (!!reoccurringSchedule) {
            this.disableCheckbox();
        }

        this.checkboxSubscription = this.transactionForm.controls[TransactionFormNames.ReoccurringSchedule].valueChanges
            .pipe(
                tap(schedule => {
                    if (!!schedule) {
                        this.disableCheckbox();
                    }
                    else {
                        this.enableCheckbox();
                    }
                })
            ).subscribe();
    }

    ngOnDestroy() {
        this.checkboxSubscription.unsubscribe();
    }


    private disableCheckbox() {
        this.resetValue();
        this.transactionForm.controls[TransactionFormNames.Cleared].disable();
    }

    private enableCheckbox() {
        this.resetValue();
        this.transactionForm.controls[TransactionFormNames.Cleared].enable();
    }

    private resetValue() {
        this.transactionForm.controls[TransactionFormNames.Cleared].patchValue(false);
    }
}
