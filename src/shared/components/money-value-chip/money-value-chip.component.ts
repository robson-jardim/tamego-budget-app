import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-money-value-chip',
    templateUrl: './money-value-chip.component.html',
    styleUrls: ['./money-value-chip.component.scss']
})
export class MoneyValueChipComponent implements OnInit {

    @Input() value: number;
    @Input() currencyType: string;

    constructor() {
    }

    ngOnInit() {
    }

    public get color() {
        if (this.value > 0) {
            return 'accent';
        }
        else if (this.value < 0) {
            return 'warn';
        }

    }

}
