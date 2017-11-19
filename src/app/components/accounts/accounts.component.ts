import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-budget',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccountsComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
