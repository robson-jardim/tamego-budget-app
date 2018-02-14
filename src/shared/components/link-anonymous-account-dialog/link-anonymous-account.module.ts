import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkAnonymousAccountDialogComponent } from '@shared/components/link-anonymous-account-dialog/link-anonymous-account-dialog.component';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { AuthenticateUserModule } from '../../../app/authenticate/authenticate-user.module';

@NgModule({
    imports: [
        CommonModule,
        StandardMaterialModule,
        CustomMaterialFormsModule,
        AuthenticateUserModule
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
