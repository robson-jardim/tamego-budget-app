import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/components/header/header.component';
import { MatButtonModule, MatToolbarModule } from '@angular/material';
import { LinkAnonymousAccountDialogComponent } from '@shared/components/header/link-anonymous-account-dialog/link-anonymous-account-dialog.component';

@NgModule({
    imports: [
        CommonModule,

        MatToolbarModule,
        MatButtonModule
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
export class HeaderModule {
}
