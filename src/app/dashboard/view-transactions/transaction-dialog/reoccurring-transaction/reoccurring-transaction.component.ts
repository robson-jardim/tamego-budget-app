import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TransactionFormNames } from '../../shared/transaction-form-names.enum';
import { ReoccurringSchedules } from '@shared/enums/reoccurring-schedules.enum';

@Component({
    selector: 'app-repeat-transaction',
    templateUrl: './reoccurring-transaction.component.html',
    styleUrls: ['./reoccurring-transaction.component.scss']
})
export class RepeatTransactionComponent implements OnInit {

    @Input() transactionForm: FormGroup;
    public TransactionFormNames = TransactionFormNames;

    public repeatOptions: Array<any> = [
        {
            name: 'Daily',
            frequency: ReoccurringSchedules.Daily
        },
        {
            name: 'Weekly',
            frequency: ReoccurringSchedules.Weekly
        },
        {
            name: 'Every other week',
            frequency: ReoccurringSchedules.EveryOtherWeek
        },
        {
            name: 'Monthly',
            frequency: ReoccurringSchedules.Monthly
        },
        {
            name: 'Yearly',
            frequency: ReoccurringSchedules.Yearly
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }
}
