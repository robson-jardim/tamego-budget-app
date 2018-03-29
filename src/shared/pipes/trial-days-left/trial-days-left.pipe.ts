import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'daysUntil'
})
export class TrialDaysLeftPipe implements PipeTransform {

    transform(endDate: Date, args?: any): any {
        const now = new Date();

        const timeDiff = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (diffDays < 0) {
            return 0;
        }
        else if (diffDays > 30) {
            return 30;
        }
        else {
            return diffDays;
        }
    }

}
