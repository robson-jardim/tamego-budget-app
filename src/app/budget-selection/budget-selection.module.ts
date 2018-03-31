import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { BudgetSelectionComponent } from './budget-selection.component';
import { BudgetDialogComponent } from './budget-dialog/budget-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { RouterModule } from '@angular/router';
import { MatMenuModule, MatTableModule } from '@angular/material';
import { BudgetSelectionTableComponent } from './budget-selection-table/budget-selection-table.component';

@NgModule({
    imports: [
        CommonModule,
        AppHeaderModule,
        CustomMaterialFormsModule,
        StandardMaterialModule,
        RouterModule,
        MatTableModule,
        MatMenuModule
    ],
    declarations: [
        BudgetSelectionComponent,
        BudgetDialogComponent,
        BudgetSelectionTableComponent,
    ],
    entryComponents: [
        BudgetDialogComponent
    ]
})
export class BudgetSelectionModule {
}
