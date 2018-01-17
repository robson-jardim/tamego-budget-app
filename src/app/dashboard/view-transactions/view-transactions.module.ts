import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { ViewTransactionsComponent } from './view-transactions.component';

import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { MatAutocompleteModule, MatDatepickerModule } from '@angular/material';
import { UtcDatePipe } from '@shared/pipes/utc-date/utc-date.pipe';

@NgModule({
    declarations: [
        ViewTransactionsComponent,
        TransactionDialogComponent,
        UtcDatePipe
    ],
    imports: [
        CommonModule,
        StandardMaterialModule,

        CustomMaterialFormsModule,
        MatAutocompleteModule,
        MatDatepickerModule
    ],

    entryComponents: [
        TransactionDialogComponent
    ]
})
export class ViewTransactionsModule {
}
