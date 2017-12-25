import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OfflineDialogComponent } from '../../components/dialogs/offline-dialog/offline-dialog.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class RequestService {

    constructor(private http: HttpClient,
                private dialog: MatDialog) {
    }

    public post(endpoint: string, data = {}, showOfflinePopup = false) {
        return this.http.post(environment.functions + endpoint, data).catch(error => {
            if (error.status === 0) {
                this.openOfflineDialog();
            }
            return Observable.throw(error);
        });
    }

    public openOfflineDialog() {
        this.dialog.open(OfflineDialogComponent);
    }
}
