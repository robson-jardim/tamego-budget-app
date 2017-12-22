import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OfflineDialogComponent } from '../../offline-dialog/offline-dialog.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class RequestService {

    constructor(private http: HttpClient,
                private dialog: MatDialog) {
    }

    public post(endpoint: string) {
        return this.http.post(environment.functions + endpoint, {}).catch(error => {
            if (error.status == 0) {
                this.dialog.open(OfflineDialogComponent);
            }
            return Observable.throw(error);
        });
    }
}
