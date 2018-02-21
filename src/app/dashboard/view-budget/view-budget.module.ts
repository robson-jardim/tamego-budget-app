import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBudgetComponent } from './view-budget.component';
import { CategoryGroupDialogComponent } from './category-group-dialog/category-group-dialog.component';
import { EditCategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { MatMenuModule, MatTableModule } from '@angular/material';
import { BudgetCategoriesTableComponent } from './budget-categories-table/budget-categories-table.component';

@NgModule({
    imports: [
        CommonModule,

        CustomMaterialFormsModule,
        StandardMaterialModule,
        MatTableModule,
        MatMenuModule,
    ],
    declarations: [
        ViewBudgetComponent,
        CategoryGroupDialogComponent,
        EditCategoryDialogComponent,
        BudgetCategoriesTableComponent
    ],
    entryComponents: [
        CategoryGroupDialogComponent,
        EditCategoryDialogComponent
    ]
})
export class ViewBudgetModule {
}
