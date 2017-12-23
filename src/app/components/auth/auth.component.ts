import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { OfflineDialogComponent } from '../../offline-dialog/offline-dialog.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import "rxjs/add/operator/catch";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    constructor(public http: HttpClient,
                private dialog: MatDialog) {
    }

    ngOnInit() {
    }

    public test() {

        this.wrapper().subscribe(response => {
            console.log(response);
        }, error => {
            console.error(error);
        });
    }

    public wrapper() {
        return this.http.get('https://jsonplaceholder.typicode.com/users').catch(error => {
            if (error.status == 0) {
                this.dialog.open(OfflineDialogComponent);
            }
            return Observable.throw(error);
        });
    }
}