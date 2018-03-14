import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UtilityService {

    constructor(private afs: AngularFirestore) {
    }

    public convertToUtc(date: Date) {

        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const utcDate = new Date(Date.UTC(year, month, day));

        return utcDate;
    }

    public convertToLocal(date: Date) {

        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();

        const utcDate = new Date(year, month, day);

        return utcDate;
    }

    public dateToString(date: Date) {
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        // Makes sure month and day fills 2 spaces
        const formattedDay = ('0' + day).slice(-2);
        const formattedMonth = ('0' + month).slice(-2);

        return year + '-' + formattedMonth + '-' + formattedDay;
    }

    public utcToday(): Date {
        const today = new Date();
        const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        return utcToday;
    }

    public combineLatestObj(obj: Object): Observable<any> {

        const sources = [];
        const keys = [];

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
                sources.push(obj[key]);
            }
        }

        return Observable.combineLatest(sources, function () {
            const argsLength = arguments.length;
            const combination = {};
            for (let i = argsLength - 1; i >= 0; i--) {
                combination[keys[i]] = arguments[i];
            }
            return combination;
        });
    }
}
