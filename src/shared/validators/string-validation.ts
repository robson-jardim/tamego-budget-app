import { AbstractControl, FormControl } from '@angular/forms';

export class StringValidation {

    static NotEmptyStringValidator(control: AbstractControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }
}

