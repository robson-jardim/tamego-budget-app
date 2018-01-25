import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { PayeeId } from '@models/payee.model';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { BudgetAccountId } from '@models/budget-account.model';
import { TransactionFormNames } from '../../shared/transaction-form-names.enum';

@Component({
    selector: 'app-payee-autocomplete',
    templateUrl: './payee-autocomplete.component.html',
    styleUrls: ['./payee-autocomplete.component.scss']
})
export class PayeeAutocompleteComponent implements OnInit, OnChanges {

    public TransactionFormNames = TransactionFormNames;
    public transactionForm: FormGroup;
    @Input() payees: PayeeId[];
    @Input() accounts: BudgetAccountId[];
    @Input() selectedPayeeId: string;

    filteredPayees$: Observable<PayeeId[]>;

    constructor(private controlContainer: ControlContainer) {
    }

    ngOnInit() {
        this.transactionForm = this.controlContainer.control as FormGroup;

        const [payee] = this.payees.filter(x => x.payeeId === this.selectedPayeeId);
        const [account] = this.accounts.filter(x => x.budgetAccountId === this.selectedPayeeId);

        debugger;

        const fillValue = payee ? payee : account;

        this.transactionForm.patchValue({
            payee: fillValue
        });


        this.filterAction();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.transactionForm) {
            this.filterAction();
        }
    }

    public filterAction() {
        this.filteredPayees$ = this.transactionForm.get(TransactionFormNames.Payee).valueChanges
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

    public displayPayeeName(entity: any) {
        if (entity && entity.payeeId) {
            return entity.payeeName;
        }
        else if (entity && entity.budgetAccountId) {
            return entity.accountName;
        }
        else {
            return entity;
        }
    }

    private filterPayees(name: string) {
        return this.payees.filter(payee => {
            return payee.payeeName.toLowerCase().includes(name.toLowerCase());
        });
    }
}

