import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatListModule,
    MatMenuModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatSelectModule,
    MatSidenavModule, MatSnackBarModule, MatTableModule,
    MatToolbarModule
} from '@angular/material';

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
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
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
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    declarations: []
})
export class AppMaterialModule {
}
