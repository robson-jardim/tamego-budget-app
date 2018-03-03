import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyValueChipComponent } from '@shared/components/money-value-chip/money-value-chip.component';
import { MatChipsModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatChipsModule
    ],
    declarations: [
        MoneyValueChipComponent
    ],
    exports: [
        MoneyValueChipComponent
    ]
})
export class MoneyValueChipModule {
}
