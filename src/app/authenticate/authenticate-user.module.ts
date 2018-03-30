import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { MatTabsModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AuthenticateComponent } from './authenticate-user.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignupModule } from '@shared/components/signup/signup.module';
import { SigninModule } from '@shared/components/signin/signin.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        StandardMaterialModule,
        CustomMaterialFormsModule,
        MatTabsModule,

        AppHeaderModule,
        SignupModule,
        SigninModule
    ],
    declarations: [
        AuthenticateComponent,
        PasswordResetComponent
    ]
})
export class AuthenticateUserModule {
}
