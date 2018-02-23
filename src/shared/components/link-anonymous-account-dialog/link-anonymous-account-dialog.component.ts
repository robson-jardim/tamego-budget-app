import { Component, OnInit } from '@angular/core';
import { BudgetDialogComponent } from '../../../app/budget-selection/budget-dialog/budget-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-anonymous-user-signup-dialog',
    templateUrl: './link-anonymous-account-dialog.component.html',
    styleUrls: ['./link-anonymous-account-dialog.component.scss']
})
export class LinkAnonymousAccountDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<BudgetDialogComponent>) {
    }

    ngOnInit() {
    }
}
