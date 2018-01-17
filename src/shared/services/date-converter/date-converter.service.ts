import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class DateConverterService {

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
}
