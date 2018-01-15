import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { OfflineDialogComponent } from '@shared/components/offline-dialog/offline-dialog.component';

@Injectable()
export class HttpRequestService {

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
