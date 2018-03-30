import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TransactionFormNames } from '../../shared/transaction-form-names.enum';
import { FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { UtilityService } from '@shared/services/utility/utility.service';

@Component({
    selector: 'app-cleared-checkbox',
    templateUrl: './cleared-checkbox.component.html',
    styleUrls: ['./cleared-checkbox.component.scss']
})
export class ClearedCheckboxComponent implements OnInit, OnDestroy {

    @Input() transactionForm: FormGroup;
    public TransactionFormNames = TransactionFormNames;

    private reoccurringSubscription: Subscription;
    private transactionDateSubscription: Subscription;

    constructor(private utility: UtilityService) {
    }

    ngOnInit() {
        if (this.isReoccurring()) {
            this.disableCheckbox();
        }

        if (this.isTransactionDateInFuture()) {
            this.disableCheckbox();
        }

        this.watchReoccurringChanges();
        this.watchTransactionDateChanges();
    }

    private watchTransactionDateChanges() {
        this.transactionDateSubscription = this.transactionForm.controls[TransactionFormNames.TransactionDate].valueChanges
            .pipe(
                tap(() => {
                    if (this.isTransactionDateInFuture()) {
                        this.disableCheckbox();
                    }
                    else {
                        this.enableCheckbox();
                    }
                })
            ).subscribe();
    }

    private watchReoccurringChanges() {
        this.reoccurringSubscription = this.transactionForm.controls[TransactionFormNames.ReoccurringSchedule].valueChanges
            .pipe(
                tap(() => {
                    if (this.isReoccurring()) {
                        this.disableCheckbox();
                    }
                    else {
                        this.enableCheckbox();
                    }
                })
            ).subscribe();
    }

    private isTransactionDateInFuture() {
        const today = this.utility.utcToday();
        const transactionDate = this.transactionForm.controls[TransactionFormNames.TransactionDate].value;

        return transactionDate > today;
    }

    private isReoccurring() {
        const reoccurringSchedule = this.transactionForm.controls[TransactionFormNames.ReoccurringSchedule].value;
        return !!reoccurringSchedule;
    }

    ngOnDestroy() {
        this.reoccurringSubscription.unsubscribe();
        this.transactionDateSubscription.unsubscribe();
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
