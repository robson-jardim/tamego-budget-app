import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginSignupComponent } from './login-signup.component';
import {
    MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatIconModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,

        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule
    ],
    declarations: [
        LoginSignupComponent
    ],
    entryComponents: []
})
export class LoginSignupModule {
}
