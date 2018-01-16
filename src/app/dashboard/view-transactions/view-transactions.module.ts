import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayeeAutocompleteComponent } from './payee-autocomplete/payee-autocomplete.component';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { ViewTransactionsComponent } from './view-transactions.component';

import { AppPipesModule } from '@shared/pipes/app-pipes.module';
import { GeneralMaterialModule } from '@shared/components/general-material.module';
import { CustomFormModule } from '@shared/components/custom-form.module';
import { MatAutocompleteModule, MatDatepickerModule } from '@angular/material';


@NgModule({
    declarations: [
        ViewTransactionsComponent,
        PayeeAutocompleteComponent,
        TransactionDialogComponent,
    ],
    imports: [
        CommonModule,
        GeneralMaterialModule,

        CustomFormModule,
        AppPipesModule,
        MatAutocompleteModule,
        MatDatepickerModule
    ],

    entryComponents: [
        TransactionDialogComponent
    ]
})
export class ViewTransactionsModule {
}
