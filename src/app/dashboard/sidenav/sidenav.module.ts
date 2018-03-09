import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule, MatMenuModule, MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './sidenav.component';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { MoneyValueChipModule } from '@shared/components/money-value-chip/money-value-chip.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CustomMaterialFormsModule,
        StandardMaterialModule,
        MoneyValueChipModule,
        MatListModule,
        MatSidenavModule,
        MatMenuModule
    ],
    declarations: [
        SidenavComponent,
        AccountDialogComponent
    ],
    entryComponents: [
        AccountDialogComponent
    ],
    exports: [
        SidenavComponent,
        MatSidenavModule
    ]
})
export class SidenavModule {
}
