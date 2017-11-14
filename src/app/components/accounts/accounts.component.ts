import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'app-budget',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccountsComponent implements OnInit {

    id = 5;
    id2 = 6;
    id3 = 7;

    constructor (private route: ActivatedRoute) {
    }

    ngOnInit () {

    }

}
