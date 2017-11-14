import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule
} from "@angular/material";

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        MatListModule,
    ],
    exports: [
        MatButtonModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        MatListModule,
    ],
    declarations: []
})
export class AppMaterialModule {
}
