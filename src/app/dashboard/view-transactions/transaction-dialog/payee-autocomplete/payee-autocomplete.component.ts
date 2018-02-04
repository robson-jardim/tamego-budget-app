import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { instanceOfPayeeId, PayeeId } from '@models/payee.model';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { BudgetAccount, BudgetAccountId, instanceOfBudgetAccountId } from '@models/budget-account.model';
import { TransactionFormNames } from '../../shared/transaction-form-names.enum';

@Component({
    selector: 'app-payee-autocomplete',
    templateUrl: './payee-autocomplete.component.html',
    styleUrls: ['./payee-autocomplete.component.scss']
})
export class PayeeAutocompleteComponent implements OnInit, OnChanges {

    public TransactionFormNames = TransactionFormNames;
    @Input() transactionForm: FormGroup;
    @Input() payees: PayeeId[];
    @Input() accounts: BudgetAccountId[];
    @Input() selectedPayeeId: string;

    // TODO - make filteredAccounts$, filter separately from payees
    filteredPayees$: Observable<PayeeId[]>;

    constructor() {
    }

    ngOnInit() {
        const [payee] = this.payees.filter(x => x.payeeId === this.selectedPayeeId);
        const [account] = this.accounts.filter(x => x.budgetAccountId === this.selectedPayeeId);

        const initialPayeeValue = new Object;
        initialPayeeValue[this.TransactionFormNames.Payee] = payee ? payee : account;
        this.transactionForm.patchValue(initialPayeeValue);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.filterAutocompleteOptions();
    }

    public filterAutocompleteOptions() {
        this.filteredPayees$ = this.transactionForm.controls[TransactionFormNames.Payee].valueChanges
            .pipe(
                startWith(null),
                map(input => {
                    if (instanceOfPayeeId(input)) {
                        return input.payeeName;
                    }
                    else if (instanceOfBudgetAccountId(input)) {
                        return input.accountName;
                    }
                    else {
                        return input;
                    }
                }),
                map(input => input ? this.filterPayees(input) : this.payees.slice())
            );
    }

    public displayPayeeName(entity: any) {
        if (instanceOfPayeeId(entity)) {
            return entity.payeeName;
        }
        else if (instanceOfBudgetAccountId(entity)) {
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

    public isAccountSelectedAsOrigin(account: BudgetAccountId) {
        return this.transactionForm.controls[TransactionFormNames.AccountId].value === account.budgetAccountId;
    }
}

