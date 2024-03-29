import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/takeUntil';

// This enum must map strings because values need to be checked inside dialog templates
export enum DialogState {
    Update = 'UPDATE',
    Create = 'CREATE',
    Delete = 'DELETE'
}

@Injectable()
export class CloseDialogService {

    // TODO - move all dialogs to use dialog service

    // This service closes out any open dialogs boxes across all tabs
    // whenever a sign out event occurs

    private defaultConfig = {
        data: {}
    };

    constructor(private dialog: MatDialog,
                private auth: AuthService) {
        // TODO - add saving flag to all dialogs
    }

    public openUpdate(component, config: any = this.defaultConfig): MatDialogRef<any> {
        config.data.state = DialogState.Update;
        return this.open(component, config);
    }

    public openCreate(component, config: any = this.defaultConfig): MatDialogRef<any> {
        config.data.state = DialogState.Create;
        return this.open(component, config);
    }

    public open(component, config: any = this.defaultConfig): MatDialogRef<any> {
        const dialog = this.dialog.open(component, config);
        this.closeDialogOnSignout(dialog);
        return dialog;
    }

    private closeDialogOnSignout(dialog: MatDialogRef<any>) {

        const userLoggedOut$ = this.auth.userLoggedOutEvent();
        const dialogClosed$ = dialog.afterClosed();

        userLoggedOut$.takeUntil(dialogClosed$).subscribe(() => {
            dialog.close();
        });
    }
}
