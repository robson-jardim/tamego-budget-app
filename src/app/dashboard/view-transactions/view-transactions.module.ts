import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { ViewTransactionsComponent } from './view-transactions.component';

import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import {
    MatAutocompleteModule,
    MatCheckboxModule, MatChipsModule,
    MatDatepickerModule,
    MatMenuModule,
    MatNativeDateModule,
    MatTableModule, MatTooltipModule
} from '@angular/material';
import { PayeeAutocompleteComponent } from './transaction-dialog/payee-autocomplete/payee-autocomplete.component';
import { CategoryAutocompleteComponent } from './transaction-dialog/category-autocomplete/category-autocomplete.component';
import { UtcDatepickerComponent } from './transaction-dialog/utc-datepicker/utc-datepicker.component';
import { RepeatTransactionComponent } from './transaction-dialog/reoccurring-transaction/reoccurring-transaction.component';
import { AppPipesModule } from '@shared/pipes/pipes.module';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';
import { MoneyValueChipModule } from '@shared/components/money-value-chip/money-value-chip.module';
import { ReconcileTransactionsComponent } from './view-transaction/reconcile-transactions/reconcile-transactions.component';
import { ReconcileConfirmDialogComponent } from './view-transaction/reconcile-dialog/reconcile-dialog.component';
import { ClearedCheckboxComponent } from './transaction-dialog/cleared-checkbox/cleared-checkbox.component';

@NgModule({
    declarations: [
        ViewTransactionsComponent,
        TransactionDialogComponent,
        PayeeAutocompleteComponent,
        CategoryAutocompleteComponent,
        UtcDatepickerComponent,
        RepeatTransactionComponent,
        TransactionTableComponent,
        ReconcileTransactionsComponent,
        ReconcileConfirmDialogComponent,
        ClearedCheckboxComponent
    ],
    imports: [
        CommonModule,
        StandardMaterialModule,
        AppPipesModule,
        MoneyValueChipModule,

        CustomMaterialFormsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatTableModule,
        MatMenuModule,
        MatTooltipModule,
        MatChipsModule
    ],
    entryComponents: [
        TransactionDialogComponent,
        ReconcileConfirmDialogComponent
    ]
})
export class ViewTransactionsModule {
}
