import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderModule } from '@shared/components/header/header.module';
import { BudgetSelectionComponent } from './budget-selection.component';
import { AddBudgetDialogComponent } from './add-budget-dialog/add-budget-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        CustomMaterialFormsModule,
        StandardMaterialModule,
        RouterModule
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
