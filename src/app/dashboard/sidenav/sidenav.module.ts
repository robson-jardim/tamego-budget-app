import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatSidenavModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './sidenav.component';
import { AddAccountToBudgetDialogComponent } from './add-account-to-budget-dialog/add-account-to-budget-dialog.component';
import { CustomFormModule } from '@shared/components/custom-form.module';
import { GeneralMaterialModule } from '@shared/components/general-material.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CustomFormModule,
        GeneralMaterialModule,

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
