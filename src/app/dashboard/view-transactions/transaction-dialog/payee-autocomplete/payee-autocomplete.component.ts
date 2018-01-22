import { Component, Input, OnInit, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { PayeeId } from '@models/payee.model';
import { Observable } from 'rxjs/Observable';
import { MatAutocomplete } from '@angular/material';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-payee-autocomplete',
    templateUrl: './payee-autocomplete.component.html',
    styleUrls: ['./payee-autocomplete.component.scss']
})
export class PayeeAutocompleteComponent implements OnInit, OnChanges {

    public transactionForm: FormGroup;
    @Input() payees: PayeeId[];
    @Input() selectedPayeeId: string;

    filteredPayees$: Observable<PayeeId[]>;

    constructor(private controlContainer: ControlContainer) {
    }

    ngOnInit() {
        this.transactionForm = this.controlContainer.control as FormGroup;
        // this.matAutocomplete.showPanel = true; // Always show panel when in focus

        const [payee] = this.payees.filter(x => x.payeeId === this.selectedPayeeId);

        this.transactionForm.patchValue({
            payee
        });

        this.filterAction();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.transactionForm) {
            this.filterAction();
        }
    }

    public filterAction() {
        this.filteredPayees$ = this.transactionForm.get('payee').valueChanges
            .pipe(
                startWith(null),
                map(input => {
                    // Defines the case that the input is a PayeeId object
                    if (input && input.payeeName) {
                        return input.payeeName;
                    }
                    else {
                        return input;
                    }
                }),
                map(input => input ? this.filterPayees(input) : this.payees.slice())
            );
    }

    public displayPayeeName(payee: PayeeId) {
        if (payee && payee.payeeName) {
            return payee.payeeName;
        }
        else {
            return payee;
        }
    }

    private filterPayees(name: string) {
        return this.payees.filter(payee => {
            return payee.payeeName.toLowerCase().includes(name.toLowerCase());
        });
    }
}
