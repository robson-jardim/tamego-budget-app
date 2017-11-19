import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as firebase from "firebase";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestoreDocument } from "angularfire2/firestore";
import { Budget, DatabaseService } from "../../services/database/database.service";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {


    constructor() {
    }

    ngOnInit() {
    }
}
