import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth-service/auth.service";
import { Router } from "@angular/router";
import { AuthNotificationService } from "../../services/auth-notification/auth-notification.service";

@Component({
    selector: 'app-login-signup',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit {

    public createAccountForm: FormGroup;
    public signInForm: FormGroup;

    constructor (private auth: AuthService, private formBuilder: FormBuilder, private router: Router, private authNotification: AuthNotificationService) {
    }

    ngOnInit () {
        this.buildSignInForm();
        this.buildCreateAccountForm();
    }

    private buildSignInForm () {
        this.signInForm = this.formBuilder.group({
            email: ['', [
                Validators.email
            ]],
            //Don't check for min length on password because all identity providers have different requirements
            password: ['', [
                Validators.required
            ]]
        });
    }

    private buildCreateAccountForm () {
        this.createAccountForm = this.formBuilder.group({
            email: ['',
                Validators.email
            ],
            password: ['', [
                Validators.required,
                Validators.minLength(6)
            ]]
        });

    }

    public signInWithEmailAndPassword (formValues) {
        if (this.signInForm.valid) {
            this.auth.signInWithEmailAndPassword(formValues.email, formValues.password)
                .then(() => {
                    this.router.navigate(['/budgets']);
                })
        }
    }

    public createUserWithEmailAndPassword (formValues) {
        if (this.createAccountForm.valid) {
            this.auth.createUserWithEmailAndPassword(formValues.email, formValues.password)
                .then(() => {
                    this.router.navigate(['/budgets']);
                })
        }
    }
}
