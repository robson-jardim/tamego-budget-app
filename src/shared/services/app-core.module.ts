import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthNotificationService } from '@shared/services/auth-notification/auth-notification.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { MapFirestoreDocumentIdService } from '@shared/services/map-firestore-document-id/map-firestore-docoument-id.service';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { environment } from '@environments/environment';
import { AngularFireModule } from 'angularfire2';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { DateConverterService } from '@shared/services/date-converter/date-converter.service';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';

@NgModule({
    imports: [
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),
    ],
    providers: [
        FirestoreService,

        AuthService,
        AuthNotificationService,

        FirestoreReferenceService,
        MapFirestoreDocumentIdService,

        GeneralNotificationsService,
        CloseDialogService,
        DateConverterService
    ]
})
export class AppCoreModule {
}
