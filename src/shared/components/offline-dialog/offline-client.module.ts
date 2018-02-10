import { NgModule } from '@angular/core';
import { OfflineDialogComponent } from '@shared/components/offline-dialog/offline-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { HttpRequestService } from '@shared/services/http-request/http-request.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from '@shared/interceptors/token.interceptor';

@NgModule({
    imports: [
        HttpClientModule,
        CustomMaterialFormsModule,
        StandardMaterialModule
    ],
    declarations: [
        OfflineDialogComponent
    ],
    entryComponents: [
        OfflineDialogComponent
    ],
    providers: [
        HttpRequestService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ]
})
export class OfflineClientModule {
}
