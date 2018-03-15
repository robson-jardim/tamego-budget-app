import { AbstractControl, FormControl } from '@angular/forms';

export class StringValidation {

    static NoWhitespaceValidator(control: AbstractControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }
}

