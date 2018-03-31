import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { MatTabsModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateComponent } from './authenticate-user.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignupModule } from '@shared/components/signup/signup.module';
import { SigninModule } from '@shared/components/signin/signin.module';
import { SigninComponent } from '@shared/components/signin/signin.component';
import { SignupComponent } from '@shared/components/signup/signup.component';
import { SignedOutGuard } from '@shared/guards/signed-in/signed-in.guard';

const routes: Routes = [
    {
        path: '',
        component: AuthenticateComponent,
        canActivate: [SignedOutGuard],
        children: [
            {
                path: 'signin',
                component: SigninComponent
            },
            {
                path: 'signup',
                component: SignupComponent
            },
            // {
            //     path: 'password_reset',
            //     component: PasswordResetComponent
            // },
            {
                path: '**',
                redirectTo: 'signin', // Redirects to sign in page
                pathMatch: 'full'
            }
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
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
