import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AccountDialogComponent } from '../dashboard/sidenav/account-dialog/account-dialog.component';

export enum UpdateDecision { Accepted, Declined }

@Component({
    selector: 'app-update-available-dialog',
    templateUrl: './update-available-dialog.component.html',
    styleUrls: ['./update-available-dialog.component.scss']
})
export class UpdateAvailableDialogComponent implements OnInit {

    public disableReload;
    public onUpdateDecision = new EventEmitter<UpdateDecision>();

    constructor(private dialogRef: MatDialogRef<UpdateAvailableDialogComponent>) {
    }

    ngOnInit() {
    }

    public acceptUpdates() {
        this.onUpdateDecision.emit(UpdateDecision.Accepted);
        this.reload();
    }

    private reload() {
        this.disableReload = true;
        window.location.reload();
    }

    public declineUpdates() {
        this.onUpdateDecision.emit(UpdateDecision.Declined);
        this.dialogRef.close();
    }
}
