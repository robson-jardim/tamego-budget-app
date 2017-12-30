import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthNotificationService } from '../../shared/services/auth-notification/auth-notification.service';
import { AuthService } from '../../shared/services/auth/auth.service';

@NgModule({
    imports: [
        AngularFireAuthModule,
        AngularFirestoreModule,
    ],
    providers: [AuthService, AuthNotificationService],
    declarations: []
})
export class AppFirebaseModule {
}
