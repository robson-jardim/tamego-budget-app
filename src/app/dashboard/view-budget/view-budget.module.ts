import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBudgetComponent } from './view-budget.component';
import { CategoryGroupDialogComponent } from './category-group-dialog/category-group-dialog.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { MatMenuModule, MatTableModule } from '@angular/material';
import { BudgetCategoriesTableComponent } from './budget-categories-table/budget-categories-table.component';
import { AppPipesModule } from '@shared/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,

        CustomMaterialFormsModule,
        StandardMaterialModule,
        AppPipesModule,
        MatTableModule,
        MatMenuModule,
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
