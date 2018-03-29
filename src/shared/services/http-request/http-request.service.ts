import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { OfflineDialogComponent } from '@shared/components/offline-dialog/offline-dialog.component';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class HttpRequestService {

    constructor(private http: HttpClient,
                private dialog: MatDialog,
                private afAuth: AngularFireAuth) {
    }

    public post(endpoint: string, data = {}, showOfflinePopup = false) {
        return this.http.post(environment.functions + endpoint, data).catch(error => {
            if (error.status === 0 && showOfflinePopup) {
                this.openOfflineDialog();
            }
            throw error;
        });
    }

    // This does not use the dialog closing service because the functionality is
    // unable to be replicated without circular references
    // TODO - rewrite to close on event
    public openOfflineDialog() {
        this.dialog.open(OfflineDialogComponent);
    }
}
