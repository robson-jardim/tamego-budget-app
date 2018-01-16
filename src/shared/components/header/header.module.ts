import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/components/header/header.component';
import { MatButtonModule, MatToolbarModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,

        MatToolbarModule,
        MatButtonModule
    ],
    declarations: [
        HeaderComponent
    ],
    exports: [
        HeaderComponent
    ]
})
export class HeaderModule {
}
