import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-confirm-cancellation-dialog',
    templateUrl: './confirm-cancellation-dialog.component.html',
    styleUrls: ['./confirm-cancellation-dialog.component.scss']
})
export class ConfirmCancellationDialogComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<ConfirmCancellationDialogComponent>) {
    }

    ngOnInit() {
    }

    public confirm() {
        this.dialogRef.close(true);
    }

    public close() {
        this.dialogRef.close(false);
    }
}
