import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { CustomMaterialFormsModule } from 'shared/components/custom-material-forms.module';
import { StandardMaterialModule } from 'shared/components/standard-material.module';

@NgModule({
    imports: [
        CommonModule,
        CustomMaterialFormsModule,
        StandardMaterialModule
    ],
    declarations: [
        SignupComponent
    ],
    exports: [
        SignupComponent
    ]
})
export class SignupModule {
}
