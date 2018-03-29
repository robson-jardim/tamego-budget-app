import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrialDaysLeftPipe } from '@shared/pipes/trial-days-left/trial-days-left.pipe';
import { UtcDatePipe } from '@shared/pipes/utc-date/utc-date.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        TrialDaysLeftPipe,
        UtcDatePipe
    ],
    exports: [
        TrialDaysLeftPipe,
        UtcDatePipe
    ]
})
export class AppPipesModule {
}
