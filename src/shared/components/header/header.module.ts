import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/components/header/header.component';
import { MatMenuModule, MatToolbarModule } from '@angular/material';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { RouterModule } from '@angular/router';
import { AppPipesModule } from '@shared/pipes/pipes.module';
import { LinkAnonymousAccountModule } from '@shared/components/link-anonymous-account-dialog/link-anonymous-account.module';

@NgModule({
    imports: [
        CommonModule,
        StandardMaterialModule,
        MatToolbarModule,
        RouterModule,
        MatMenuModule,
        AppPipesModule,
        LinkAnonymousAccountModule
    ],
    declarations: [
        HeaderComponent
    ],
    entryComponents: [
    ],
    exports: [
        HeaderComponent
    ]
})
export class AppHeaderModule {
}
