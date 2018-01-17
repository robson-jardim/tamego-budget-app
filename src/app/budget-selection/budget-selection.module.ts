import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderModule } from '@shared/components/header/header.module';
import { BudgetSelectionComponent } from './budget-selection.component';
import { RouterModule } from '@angular/router';
import { AddBudgetDialogComponent } from './add-budget-dialog/add-budget-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { BudgetSelectionRoutingModule } from './budget-selection-routing.module';

@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        CustomMaterialFormsModule,
        StandardMaterialModule,
        BudgetSelectionRoutingModule
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
