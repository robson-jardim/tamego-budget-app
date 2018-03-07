import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkAnonymousAccountDialogComponent } from '@shared/components/link-anonymous-account-dialog/link-anonymous-account-dialog.component';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { SignupModule } from '../signup/signup.module';

@NgModule({
    imports: [
        CommonModule,
        StandardMaterialModule,
        CustomMaterialFormsModule,
        SignupModule
    ],
    declarations: [
        LinkAnonymousAccountDialogComponent,
    ],
    entryComponents: [
        LinkAnonymousAccountDialogComponent
    ]
})
export class LinkAnonymousAccountModule {
}
