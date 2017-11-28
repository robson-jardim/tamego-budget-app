import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { AuthNotificationService } from '../../services/auth-notification/auth-notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-login-signup',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./login-signup.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginSignupComponent implements OnInit {

    public createUserForm: FormGroup;
    public signInForm: FormGroup;

    constructor(private auth: AuthService,
                private formBuilder: FormBuilder,
                private router: Router,
                public authNotification: AuthNotificationService,
                private http: HttpClient) {

    }

    ngOnInit() {
        this.buildSignInForm();
        this.buildCreateAccountForm();
    }

    private buildSignInForm() {
        this.signInForm = this.formBuilder.group({
            email: ['', Validators.email],
            // Don't check for min length on password because all identity providers have different requirements
            password: ['', Validators.required]
        });
    }

    private buildCreateAccountForm() {
        this.createUserForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }

    public get emailErrorMessage(): string {
        if (this.createUserForm.get('email').hasError('required')) {
            return 'Email required';
        }
        else if (this.createUserForm.get('email').hasError('email')) {
            return 'Input a valid email';
        }
    }

    public signInWithEmailAndPassword(form) {
        if (this.signInForm.valid) {
            this.auth.signInWithEmailAndPassword(form.email, form.password)
                .then(() => {
                    this.router.navigate(['/budgets']);
                })
                .catch(error => {
                    // Auth notification service broadcasts the error to template
                });
        }
    }

    public createUserWithEmailAndPassword(form) {

        if (this.createUserForm.valid) {
            this.auth.createUserWithEmailAndPassword(form.email, form.password)
                .then(() => {
                    const observable = this.auth.user.subscribe(user => {
                        if (user) {
                            this.router.navigate(['budgets']);
                            observable.unsubscribe();
                        }
                    });
                })
                .catch(error => {
                    // Auth notification service broadcasts the error to template
                });
        }
    }
}
