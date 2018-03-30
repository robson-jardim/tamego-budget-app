import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { BudgetSelectionComponent } from './budget-selection.component';
import { BudgetDialogComponent } from './budget-dialog/budget-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { RouterModule, Routes } from '@angular/router';
import { MatMenuModule } from '@angular/material';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { PremiumGuard } from '@shared/guards/premium/premium.guard';
import { DemoComponent } from '../demo/demo.component';

const routes: Routes = [
    {
        path: '',
        component: BudgetSelectionComponent,
        canActivate: [AuthGuard, PremiumGuard]
    }
];

@NgModule({
    imports: [
        CommonModule,
        AppHeaderModule,
        CustomMaterialFormsModule,
        StandardMaterialModule,
        RouterModule,

        MatMenuModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        BudgetSelectionComponent,
        BudgetDialogComponent,
    ],
    entryComponents: [
        BudgetDialogComponent
    ]
})
export class BudgetSelectionModule {
}
