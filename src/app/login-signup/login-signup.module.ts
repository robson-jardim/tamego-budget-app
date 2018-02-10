import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SigninCreateAccountComponent } from './login-signup.component';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        AppHeaderModule,
        CommonModule,
        StandardMaterialModule,
        CustomMaterialFormsModule
    ],
    declarations: [
        SigninCreateAccountComponent,
    ],
    entryComponents: []
})
export class LoginSignupModule {
}
