import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBudgetComponent } from './view-budget.component';
import { CategoryGroupDialogComponent } from './category-group-dialog/category-group-dialog.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { MatMenuModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { BudgetCategoriesTableComponent } from './budget-categories-table/budget-categories-table.component';
import { AppPipesModule } from '@shared/pipes/pipes.module';
import { MoneyValueChipModule } from '@shared/components/money-value-chip/money-value-chip.module';

@NgModule({
    imports: [
        CommonModule,
        MoneyValueChipModule,

        CustomMaterialFormsModule,
        StandardMaterialModule,
        AppPipesModule,
        MatTableModule,
        MatMenuModule,
        MatTooltipModule
    ],
    declarations: [
        ViewBudgetComponent,
        CategoryGroupDialogComponent,
        CategoryDialogComponent,
        BudgetCategoriesTableComponent
    ],
    entryComponents: [
        CategoryGroupDialogComponent,
        CategoryDialogComponent
    ]
})
export class ViewBudgetModule {
}
