import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { AuthNotificationService } from '../../services/auth-notification/auth-notification.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
    selector: 'app-login-signup',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./login-signup.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginSignupComponent implements OnInit {

    public loading = false;
    public showAuthError = false;

    public hidePassword = true;
    public createUserForm: FormGroup;
    public signInForm: FormGroup;

    constructor(private auth: AuthService,
                private formBuilder: FormBuilder,
                private router: Router,
                public authNotification: AuthNotificationService,
                private afs: AngularFirestore) {
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

    public async signInWithEmailAndPassword() {
        this.loading = true;
        this.showAuthError = false;

        try {
            const email = this.signInForm.value.email;
            const password = this.signInForm.value.password;

            const user = await this.auth.signInWithEmailAndPassword(email, password);
            await this.routeToBudgetSelection(user);
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

            const doc = this.afs.doc('users/' + user.uid);
            doc.valueChanges().take(1).subscribe(async () => {
                console.log('document added');
                await this.routeToBudgetSelection(user);
            });
        } catch (error) {
            // Auth notification service broadcasts the error to template
            this.loading = false;
            this.showAuthError = true;
            console.error(error);
        }
    }

    private routeToBudgetSelection(user) {
        return this.auth.user.first().subscribe(async user => {
            await this.router.navigate(['budgets']);
        });
    }
}
