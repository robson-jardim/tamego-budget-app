import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/components/header/header.component';
import { MatButtonModule, MatToolbarModule } from '@angular/material';
import { LinkAnonymousAccountDialogComponent } from '@shared/components/link-anonymous-account-dialog/link-anonymous-account-dialog.component';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        StandardMaterialModule,
        MatToolbarModule,
        RouterModule
    ],
    declarations: [
        HeaderComponent
    ],
    entryComponents: [
        LinkAnonymousAccountDialogComponent
    ],
    exports: [
        HeaderComponent
    ]
})
export class AppHeaderModule {
}
