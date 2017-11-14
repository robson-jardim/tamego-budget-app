import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth-service/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login-signup',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit {

    public signUpForm: FormGroup;
    public loginForm: FormGroup;

    constructor (private auth: AuthService, private formBuilder: FormBuilder, private router: Router) {
    }

    ngOnInit () {
        this.buildLoginForm();
        this.buildSignUpForm();
    }

    private buildLoginForm () {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.email],
            //Don't check for min length on password because all identity providers have different requirements
            password: ['', Validators.required]
        });
    }

    private buildSignUpForm () {
        this.signUpForm = this.formBuilder.group({
            email: ['', Validators.email],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }

    public loginUserWithEmail (formValues) {
        if (this.loginForm.valid) {
            this.auth.loginUserWithEmailAndPassword(formValues.email, formValues.password)
                .then(() => {
                    this.router.navigate(['/budgets']);
                })
                .catch(error => {
                    let errorMessage = error.message;
                    let errorCode = error.code;

                    console.error(errorCode, errorMessage);
                })

        }
    }

    public signUpUserWithEmail (formValues) {
        if (this.signUpForm.valid) {
            this.auth.createUserWithEmailAndPassword(formValues.email, formValues.password)
                .then(() => {
                    this.router.navigate(['/budgets']);
                })
                .catch(error => {
                    let errorMessage = error.message;
                    let errorCode = error.code;

                    console.error(errorCode, errorMessage);
                })
        }
    }
}
