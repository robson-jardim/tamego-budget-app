import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth-service/auth.service";
import { Router } from "@angular/router";
import { AuthNotificationService } from "../../services/auth-notification/auth-notification.service";

@Component({
    selector: 'app-login-signup',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./login-signup.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginSignupComponent implements OnInit {

    public createAccount: FormGroup;
    public signIn: FormGroup;

    constructor(private auth: AuthService, private formBuilder: FormBuilder, private router: Router, private authNotification: AuthNotificationService) {
    }

    ngOnInit() {
        this.buildSignInForm();
        this.buildCreateAccountForm();
    }

    private buildSignInForm() {
        this.signIn = this.formBuilder.group({
            email: ['', Validators.email],
            //Don't check for min length on password because all identity providers have different requirements
            password: ['', Validators.required]
        });
    }

    private buildCreateAccountForm() {
        this.createAccount = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }

    public get emailErrorMessage(): string {
        if (this.createAccount.get('email').hasError('required')) {
            return 'Email required';
        }
        else if (this.createAccount.get('email').hasError('email')) {
            return 'Input a valid email'
        }
    }

    public signInWithEmailAndPassword(formValues) {
        if (this.signIn.valid) {
            this.auth.signInWithEmailAndPassword(formValues.email, formValues.password)
                .then(() => {
                    this.router.navigate(['/budgets']);
                })
                .catch(error => {
                    // Auth notification service broadcasts the error to template
                })
        }
    }

    public createUserWithEmailAndPassword(formValues) {
        if (this.createAccount.valid) {
            this.auth.createUserWithEmailAndPassword(formValues.email, formValues.password)
                .then(() => {
                    this.router.navigate(['/budgets']);
                })
                .catch(error => {
                    // Auth notification service broadcasts the error to template
                })
        }
    }
}
