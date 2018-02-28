import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { ViewTransactionsComponent } from './view-transactions.component';

import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { PayeeAutocompleteComponent } from './transaction-dialog/payee-autocomplete/payee-autocomplete.component';
import { CategoryAutocompleteComponent } from './transaction-dialog/category-autocomplete/category-autocomplete.component';
import { UtcDatepickerComponent } from './transaction-dialog/utc-datepicker/utc-datepicker.component';
import { RepeatTransactionComponent } from './transaction-dialog/reoccurring-transaction/reoccurring-transaction.component';
import { AppPipesModule } from '@shared/pipes/pipes.module';

@NgModule({
    declarations: [
        ViewTransactionsComponent,
        TransactionDialogComponent,
        PayeeAutocompleteComponent,
        CategoryAutocompleteComponent,
        UtcDatepickerComponent,
        RepeatTransactionComponent,
    ],
    imports: [
        CommonModule,
        StandardMaterialModule,
        AppPipesModule,

        CustomMaterialFormsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
    ],
    entryComponents: [
        TransactionDialogComponent
    ]
})
export class ViewTransactionsModule {
}
