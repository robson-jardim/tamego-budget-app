import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderModule } from '@shared/components/header/header.module';
import { BudgetSelectionComponent } from './budget-selection.component';
import { RouterModule } from '@angular/router';
import { AddBudgetDialogComponent } from './add-budget-dialog/add-budget-dialog.component';
import { CustomFormModule } from '@shared/components/custom-form.module';
import { GeneralMaterialModule } from '@shared/components/general-material.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        HeaderModule,
        CustomFormModule,
        GeneralMaterialModule
    ],
    declarations: [
        BudgetSelectionComponent,
        AddBudgetDialogComponent,
    ],
    entryComponents: [
        AddBudgetDialogComponent
    ]
})
export class BudgetSelectionModule {
}
