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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { DateConverterService } from '@shared/services/date-converter/date-converter.service';
import { HttpRequestService } from '@shared/services/http-request/http-request.service';
import { GeneralNotificationsService } from '@shared/services/general-notifications/general-notifications.service';
import { TokenInterceptor } from '@shared/interceptors/token.interceptor';

@NgModule({
    imports: [
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),
        HttpClientModule
    ],
    providers: [
        AuthService,
        FirestoreService,
        FirestoreReferenceService,
        MapFirestoreDocumentIdService,
        AuthNotificationService,
        HttpRequestService,
        CloseDialogService,
        DateConverterService,
        GeneralNotificationsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    declarations: []
})
export class AppCoreModule {
}
