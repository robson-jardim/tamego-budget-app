import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/components/header/header.component';
import { MatButtonModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { LinkAnonymousAccountDialogComponent } from '@shared/components/link-anonymous-account-dialog/link-anonymous-account-dialog.component';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { RouterModule } from '@angular/router';
import { DaysUntilPipe } from '@shared/pipes/days-until/days-until.pipe';
import { AppPipesModule } from '@shared/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        StandardMaterialModule,
        MatToolbarModule,
        RouterModule,
        MatMenuModule,
        AppPipesModule
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
