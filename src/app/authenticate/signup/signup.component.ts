import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    public signupForm: FormGroup;
    public hideCreatePassword = true;
    private saving = false;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildSignupForm();
    }

    private buildSignupForm() {
        this.signupForm = this.formBuilder.group({
            email: [null, Validators.compose([Validators.required, Validators.email])],
            password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
            confirmPassword: [null]
        }, {
            validator: PasswordValidation.MatchPassword // your validation method
        });
    }

    public signupUser() {
        this.saving = true;
    }

}

class PasswordValidation {

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
