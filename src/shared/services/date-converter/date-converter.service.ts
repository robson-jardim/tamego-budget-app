import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class DateConverterService {

    constructor(private afs: AngularFirestore) {
    }

    public convertToUTC(date: Date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const utcDate = new Date(Date.UTC(year, month, day));

        return utcDate;
    }
}
