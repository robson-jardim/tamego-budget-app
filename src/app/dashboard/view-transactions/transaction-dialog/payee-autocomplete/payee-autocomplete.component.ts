import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { PayeeId } from '@models/payee.model';
import { Observable } from 'rxjs/Observable';
import { filter, map, startWith } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material';

@Component({
    selector: 'app-payee-autocomplete',
    templateUrl: './payee-autocomplete.component.html',
    styleUrls: ['./payee-autocomplete.component.scss']
})
export class PayeeAutocompleteComponent implements OnInit {

    public transactionForm: FormGroup;
    @Input() payees: PayeeId[];
    @Input() selectedPayeeId: string;

    filteredPayees$: Observable<PayeeId[]>;

    @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;

    constructor(private controlContainer: ControlContainer) {
    }

    ngOnInit() {
        this.transactionForm = this.controlContainer.control as FormGroup;

        this.payees.filter(x => x.payeeId === this.selectedPayeeId)
            .map(payee => {
                this.transactionForm.patchValue({
                    payee
                });
            });

        this.filteredPayees$ = this.transactionForm.get('payee').valueChanges
            .pipe(
                startWith(null),
                filter(x => typeof x === 'string'), // Do not go past here if a saved entity is selected
                map(userInput => userInput ? this.filterPayees(userInput) : this.payees.slice())
            );
    }

    public displayPayeeName(payee: PayeeId) {
        if (payee && payee.payeeName) {
            return payee.payeeName;
        }
        return payee;
    }

    private filterPayees(name: any) {
        return this.payees.filter(payee =>
            payee.payeeName.toLowerCase().indexOf(name.toLowerCase()) === 0
        );
    }

    public highlightFirstOption(event): void {
        if (event.key == "ArrowDown" || event.key == "ArrowUp") {
            return;
        }

        this.matAutocomplete._keyManager.setFirstItemActive();
    }
}
