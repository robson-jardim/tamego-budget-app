import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-update-available-dialog',
    templateUrl: './update-available-dialog.component.html',
    styleUrls: ['./update-available-dialog.component.scss']
})
export class UpdateAvailableDialogComponent implements OnInit {

    public disableReload;

    constructor() {
    }

    ngOnInit() {
    }

    public reload() {
        this.disableReload = true;
        window.location.reload();
    }

}
