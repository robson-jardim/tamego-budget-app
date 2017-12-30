import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material.module';
import { LoginSignupComponent } from './login-signup.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        AppMaterialModule,
        ReactiveFormsModule
    ],
    declarations: [
        LoginSignupComponent
    ]
})
export class AppLoginSignupModule {
}
