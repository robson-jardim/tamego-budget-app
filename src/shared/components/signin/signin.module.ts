import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialFormsModule } from 'shared/components/custom-material-forms.module';
import { StandardMaterialModule } from 'shared/components/standard-material.module';
import { SigninComponent } from './signin.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        CustomMaterialFormsModule,
        StandardMaterialModule,
        RouterModule
    ],
    declarations: [
        SigninComponent
    ],
    exports: [
        SigninComponent
    ]
})
export class SigninModule {
}


