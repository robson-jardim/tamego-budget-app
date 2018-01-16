import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBudgetComponent } from './view-budget.component';
import { TransferCategoryDialogComponent } from './transfer-category-dialog/transfer-category-dialog.component';
import { CategoryGroupDialogComponent } from './category-group-dialog/category-group-dialog.component';
import { EditCategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CustomFormModule } from '@shared/components/custom-form.module';
import { GeneralMaterialModule } from '@shared/components/general-material.module';
import { MatDialogModule, MatMenuModule, MatTableModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,

        CustomFormModule,
        GeneralMaterialModule,
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
