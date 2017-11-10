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

    signUpForm: FormGroup;
    loginForm: FormGroup;

    constructor (private auth: AuthService, private formBuilder: FormBuilder, private router: Router) {
    }

    ngOnInit () {
        this.buildLoginForm();
        this.buildSignupForm();
    }

    private buildSignupForm () {
        this.signUpForm = this.formBuilder.group({
            email: ['', Validators.email],
            password: ['', Validators.required]
        });
    }

    private buildLoginForm () {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.email],
            password: ['', Validators.required]
        });
    }

    public loginUserWithEmail (form) {
        if (this.loginForm.valid) {
            this.auth.loginUserWithEmailAndPassword(form.email, form.password)
                .then(() => {
                    this.router.navigateByUrl('/budgets');
                })
                .catch(error => {
                    let errorMessage = error.message;
                    let errorCode = error.code;

                    console.error(errorMessage, errorCode);
                })

        }
    }

    public signUpUserWithEmail (form) {
        if (this.signUpForm.valid) {
            this.auth.createUserWithEmailAndPassword(form.email, form.password)
                .then(() => {
                    this.router.navigateByUrl('/budgets');
                })
                .catch(error => {
                    let errorMessage = error.message;
                    let errorCode = error.code;

                    console.error(errorMessage, errorCode);
                })
        }
    }
}
