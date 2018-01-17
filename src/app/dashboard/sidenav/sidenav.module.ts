import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatSidenavModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './sidenav.component';
import { AddAccountToBudgetDialogComponent } from './add-account-to-budget-dialog/add-account-to-budget-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CustomMaterialFormsModule,
        StandardMaterialModule,

        MatListModule,
        MatSidenavModule
    ],
    declarations: [
        SidenavComponent,
        AddAccountToBudgetDialogComponent
    ],
    entryComponents: [
        AddAccountToBudgetDialogComponent
    ],
    exports: [
        SidenavComponent,
        MatSidenavModule
    ]
})
export class SidenavModule {
}
