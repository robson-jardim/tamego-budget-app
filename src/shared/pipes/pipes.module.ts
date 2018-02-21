import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaysUntilPipe } from '@shared/pipes/days-until/days-until.pipe';
import { UtcDatePipe } from '@shared/pipes/utc-date/utc-date.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        DaysUntilPipe,
        UtcDatePipe
    ],
    exports: [
        DaysUntilPipe,
        UtcDatePipe
    ]
})
export class AppPipesModule {
}
