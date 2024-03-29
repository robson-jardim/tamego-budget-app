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
import { UtilityService } from '@shared/services/utility/utility.service';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';
import { ReoccurringService } from '@shared/services/reoccurring/reoccurring.service';
import { DemoService } from '../../app/demo/demo/demo.service';

@NgModule({
    imports: [
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.firebase)
    ],
    providers: [
        FirestoreService,
        ReoccurringService,

        AuthService,
        AuthNotificationService,

        FirestoreReferenceService,
        MapFirestoreDocumentIdService,

        GeneralNotificationsService,
        CloseDialogService,
        UtilityService,
        DemoService
    ]
})
export class AppCoreModule {
}
