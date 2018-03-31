import { AbstractControl, FormControl } from '@angular/forms';

export class CurrencyValidation {

    static MatchIsCurrencyValue(control: AbstractControl) {

        const value = control.value;
        const num = Number(value);

        if (value == num.toFixed(2)) {
            return null;
        }
        else {
            return {currency: true};
        }
    }
}

