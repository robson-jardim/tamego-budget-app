import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthNotificationService } from '@shared/services/auth-notification/auth-notification.service';
import { AuthService } from '@shared/services/auth/auth.service';

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


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    public signupForm: FormGroup;
    public hideCreatePassword;

    public showAuthError;
    public saving;
    public loading;

    @Input() isAnonymousSignup;
    @Output() onSignupEvent: EventEmitter<any> = new EventEmitter();

    constructor(private formBuilder: FormBuilder,
                public authNotification: AuthNotificationService,
                private auth: AuthService) {
    }

    ngOnInit() {
        this.hideCreatePassword = true;
        this.buildSignupForm();
    }

    private buildSignupForm() {
        this.signupForm = this.formBuilder.group({
            email: [null, Validators.compose([Validators.required, Validators.email])],
            password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
            confirmPassword: [null]
        }, {
            validator: PasswordValidation.MatchPassword
        });
    }

    public async signupUser() {
        this.loading = true;
        this.saving = true;
        this.showAuthError = false;

        const email = this.signupForm.value.email;
        const password = this.signupForm.value.password;

        try {
            if (!this.isAnonymousSignup) {
                await this.auth.createUserWithEmailAndPassword(email, password);
            }
            else {
                await this.auth.linkAnonymousAccountToEmail(email, password);
            }

            this.onSignupEvent.emit();
        }
        catch (error) {
            // Auth notification service broadcasts the error to template
            this.loading = false;
            this.saving = false;
            this.showAuthError = true;
            console.error(error);
        }
    }

    public get emailErrorMessage(): string {
        if (this.signupForm.get('email').hasError('required')) {
            return 'Email required';
        }
        else if (this.signupForm.get('email').hasError('email')) {
            return 'Input a valid email';
        }
    }

}
