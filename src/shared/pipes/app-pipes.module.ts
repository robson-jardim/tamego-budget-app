import { NgModule } from '@angular/core';
import { UtcDatePipe } from '@shared/pipes/utc-date/utc-date.pipe';

@NgModule({
    imports: [],
    declarations: [
        UtcDatePipe
    ],
    exports: [
        UtcDatePipe
    ]
})
export class AppPipesModule {
}
