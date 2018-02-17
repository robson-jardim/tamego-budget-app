import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AccountDialogComponent } from '../dashboard/sidenav/account-dialog/account-dialog.component';

@Component({
    selector: 'app-update-available-dialog',
    templateUrl: './update-available-dialog.component.html',
    styleUrls: ['./update-available-dialog.component.scss']
})
export class UpdateAvailableDialogComponent implements OnInit {

    public disableReload;

    constructor(private dialogRef: MatDialogRef<UpdateAvailableDialogComponent>) {
    }

    ngOnInit() {
    }

    public acceptUpdates() {
        this.reload();
    }

    private reload() {
        this.disableReload = true;
        window.location.reload();
    }

    public declineUpdates() {
        this.dialogRef.close();
    }
}
