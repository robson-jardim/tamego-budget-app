import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { ViewTransactionsComponent } from './view-transactions.component';

import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { UtcDatePipe } from '@shared/pipes/utc-date/utc-date.pipe';
import { PayeeAutocompleteComponent } from './transaction-dialog/payee-autocomplete/payee-autocomplete.component';
import { CategoryAutocompleteComponent } from './transaction-dialog/category-autocomplete/category-autocomplete.component';

@NgModule({
    declarations: [
        ViewTransactionsComponent,
        TransactionDialogComponent,
        UtcDatePipe,
        PayeeAutocompleteComponent,
        CategoryAutocompleteComponent
    ],
    imports: [
        CommonModule,
        StandardMaterialModule,

        CustomMaterialFormsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],

    entryComponents: [
        TransactionDialogComponent
    ]
})
export class ViewTransactionsModule {
}
