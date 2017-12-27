import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from '../auth-service/auth.service';

@Injectable()
export class DialogService {

    // This service closes out any open dialogs boxes across all tabs
    // whenever a sign out event occurs

    constructor(private dialog: MatDialog,
                private auth: AuthService) {
    }

    public openUpdate(component, config: any = {}) {
        config.data.mode = 'UPDATE';
        return this.open(component, config);
    }

    public openCreate(component, config) {
        config.data.mode = 'CREATE';
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
