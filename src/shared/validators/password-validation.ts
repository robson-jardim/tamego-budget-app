import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

    static MatchPassword(control: AbstractControl) {
        const password = control.get('password').value; // to get value in input tag
        const confirmPassword = control.get('confirmPassword').value; // to get value in input tag
        if (password !== confirmPassword) {
            control.get('confirmPassword').setErrors({matchPassword: true});
        } else {
            return null;
        }
    }
}

