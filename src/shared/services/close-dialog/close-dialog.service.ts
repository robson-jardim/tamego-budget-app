import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from '../auth/auth.service';

// This enum must map strings because values need to be checked inside dialog templates
export enum DialogState {
    Update = 'UPDATE',
    Create = 'CREATE'
}

@Injectable()
export class CloseDialogService {

    // This service closes out any open dialogs boxes across all tabs
    // whenever a sign out event occurs

    constructor(private dialog: MatDialog,
                private auth: AuthService) {
    }

    public openUpdate(component, config: any = {}) {
        config.data.state = DialogState.Update;
        return this.open(component, config);
    }

    public openCreate(component, config) {
        config.data.state = DialogState.Create;
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
