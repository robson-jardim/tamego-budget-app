import { Component, OnInit } from '@angular/core';

interface RepeatOption {
    name: string;
}

@Component({
    selector: 'app-repeat-transaction',
    templateUrl: './repeat-transaction.component.html',
    styleUrls: ['./repeat-transaction.component.scss']
})
export class RepeatTransactionComponent implements OnInit {

    public repeatOptions: Array<RepeatOption> = [
        {
            name: 'Daily',
        },
        {
            name: 'Weekly',
        },
        {
            name: 'Biweekly',
        },
        {
            name: 'Monthly',
        },
        {
            name: 'Yearly',
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

    public nextDay(): Date {
        return new Date();
    }

    public nextWeek(): Date {
        return new Date();
    }

    public nextMonth(): Date {
        return new Date();
    }

    public nextYear(): Date {
        return new Date();
    }

}
