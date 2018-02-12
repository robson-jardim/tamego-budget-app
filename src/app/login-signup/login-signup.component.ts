import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth.service';
import { AuthNotificationService } from '@shared/services/auth-notification/auth-notification.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-login-signup',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./login-signup.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SigninCreateAccountComponent implements OnInit {

    // TODO - rename to signin create account
    // TODO - move to separate components

    public loading = false;
    public showAuthError = false;

    public hideCreatePassword = true;
    public hideLoginPassword = true;

    public createUserForm: FormGroup;
    public signInForm: FormGroup;

    constructor(private auth: AuthService,
                private formBuilder: FormBuilder,
                private router: Router,
                public authNotification: AuthNotificationService) {
    }

    ngOnInit() {
        this.buildSignInForm();
        this.buildCreateAccountForm();

        this.onLoginRouteToBudgets();
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

    public async signInWithEmailAndPassword() {
        this.loading = true;
        this.showAuthError = false;

        try {
            const email = this.signInForm.value.email;
            const password = this.signInForm.value.password;
            const user = await this.auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            // Auth notification service broadcasts the error to template
            this.loading = false;
            this.showAuthError = true;
            console.error(error);
        }
    }

    public async createUserWithEmailAndPassword() {
        this.loading = true;
        this.showAuthError = false;

        try {
            const email = this.createUserForm.value.email;
            const password = this.createUserForm.value.password;
            const user = await this.auth.createUserWithEmailAndPassword(email, password);
        } catch (error) {
            // Auth notification service broadcasts the error to template
            this.loading = false;
            this.showAuthError = true;
            console.error(error);
        }
    }

    private onLoginRouteToBudgets() {
        this.auth.user.first(x => x != null).subscribe(user => {
            this.router.navigate(['budgets']);
        });
    }
}
