import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from '../auth/auth.service';

export const DIALOG_STATE = {
    UPDATE: 'UPDATE',
    CREATE: 'CREATE'
};

@Injectable()
export class CloseDialogService {

    // This service closes out any open dialogs boxes across all tabs
    // whenever a sign out event occurs

    constructor(private dialog: MatDialog,
                private auth: AuthService) {
    }

    public openUpdate(component, config: any = {}) {
        config.data.state = DIALOG_STATE.UPDATE;
        return this.open(component, config);
    }

    public openCreate(component, config) {
        config.data.state = DIALOG_STATE.CREATE;
        return this.open(component, config);
    }

    private open(component, config) {
        const dialog = this.dialog.open(component, config);

        const signOutWatcher = this.auth.userLoggedOutEvent().subscribe(() => {
            dialog.close();
        });

        dialog.afterClosed().subscribe(() => {
            signOutWatcher.unsubscribe();
        });

        return dialog;
    }
}
