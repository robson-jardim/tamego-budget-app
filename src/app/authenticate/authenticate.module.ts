import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthenticateComponent } from './authenticate.component';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { MatSidenavModule, MatTabsModule } from '@angular/material';
import { RouterModule } from '@angular/router';

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
        SignupComponent
    ]
})
export class AuthenticateModule {
}
