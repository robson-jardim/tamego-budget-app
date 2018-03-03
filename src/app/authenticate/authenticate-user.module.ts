import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { MatDividerModule, MatTabsModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AuthenticateComponent } from './authenticate-user.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

@NgModule({
    imports: [
        CommonModule,
        AppHeaderModule,
        StandardMaterialModule,
        CustomMaterialFormsModule,
        MatTabsModule,
        RouterModule
    ],
    declarations: [
        AuthenticateComponent,
        SigninComponent,
        SignupComponent,
        PasswordResetComponent
    ],
    exports: [
        SigninComponent,
        SignupComponent
    ]
})
export class AuthenticateUserModule {
}
