import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';


@Component({
    selector: 'app-testing',
    templateUrl: './testing.component.html',
    styleUrls: ['./testing.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TestingComponent implements OnInit {

    constructor(private afs: AngularFirestore) {
    }

    ngOnInit() {

    }

}

