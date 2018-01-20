import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginSignupComponent } from './login-signup.component';
import { LoginSigupRoutingModule } from './login-sigup-routing.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { HeaderModule } from '@shared/components/header/header.module';

@NgModule({
    imports: [
        HeaderModule,
        CommonModule,
        StandardMaterialModule,
        CustomMaterialFormsModule,
        LoginSigupRoutingModule
    ],
    declarations: [
        LoginSignupComponent
    ],
    entryComponents: []
})
export class LoginSignupModule {
}
