import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

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
