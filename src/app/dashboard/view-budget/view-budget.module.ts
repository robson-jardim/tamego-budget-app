import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBudgetComponent } from './view-budget.component';
import { TransferCategoryDialogComponent } from './transfer-category-dialog/transfer-category-dialog.component';
import { CategoryGroupDialogComponent } from './category-group-dialog/category-group-dialog.component';
import { EditCategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { MatDialogModule, MatMenuModule, MatTableModule } from '@angular/material';

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
        TransferCategoryDialogComponent,
        CategoryGroupDialogComponent,
        EditCategoryDialogComponent
    ],
    entryComponents: [
        TransferCategoryDialogComponent,
        CategoryGroupDialogComponent,
        EditCategoryDialogComponent
    ]
})
export class ViewBudgetModule {
}
