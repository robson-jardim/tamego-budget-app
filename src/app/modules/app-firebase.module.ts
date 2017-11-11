import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from "../services/auth-service/auth.service";

@NgModule({
    imports: [
        AngularFireAuthModule,
        AngularFirestoreModule,
    ],
    providers: [AuthService],
    declarations: []
})
export class AppFirebaseModule {
}
