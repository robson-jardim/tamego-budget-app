import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth/auth.service';
import { AuthNotificationService } from '@shared/services/auth-notification/auth-notification.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

    public signInForm: FormGroup;
    public hideSigninPassword;

    private showAuthError;
    public saving;
    private loading;

    constructor(private formBuilder: FormBuilder,
                private auth: AuthService,
                public authNotification: AuthNotificationService) {
    }

    ngOnInit() {
        this.hideSigninPassword = true;
        this.buildSignInForm();
    }

    private buildSignInForm() {
        this.signInForm = this.formBuilder.group({
            email: ['', Validators.email],
            // Don't check for min length on password because all identity providers have different requirements
            password: ['', Validators.required]
        });
    }

    public async signin() {
        this.loading = true;
        this.saving = true;
        this.showAuthError = false;

        try {
            const email = this.signInForm.value.email;
            const password = this.signInForm.value.password;
            const user = await this.auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            // Auth notification service broadcasts the error to template
            this.loading = false;
            this.saving = false;
            this.showAuthError = true;
            console.error(error);
        }
    }
}
