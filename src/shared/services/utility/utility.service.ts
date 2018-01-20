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

    public combineLatestObj(obj): Observable<any> {
        const sources = [];
        const keys = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key.replace(/\$$/, ''));
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
