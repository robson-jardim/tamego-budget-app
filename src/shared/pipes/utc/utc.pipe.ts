import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'utcDate'
})
export class UtcPipe implements PipeTransform {

    transform(value): any {

        if (!value) {
            return '';
        }

        const dateValue = new Date(value);

        const dateWithNoTimezone = new Date(
            dateValue.getUTCFullYear(),
            dateValue.getUTCMonth(),
            dateValue.getUTCDate(),
            dateValue.getUTCHours(),
            dateValue.getUTCMinutes(),
            dateValue.getUTCSeconds()
        );

        return dateWithNoTimezone;
    }

}
