import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule, MatSelectModule,
    MatSidenavModule, MatSnackBarModule, MatTableModule,
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
        MatDialogModule,
        MatMenuModule,
        MatTableModule,
        MatSnackBarModule,
        MatSelectModule
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
        MatDialogModule,
        MatMenuModule,
        MatTableModule,
        MatSnackBarModule,
        MatSelectModule
    ],
    declarations: []
})
export class AppMaterialModule {
}
