import { NgModule } from '@angular/core';
import { OfflineDialogComponent } from '@shared/components/offline-dialog/offline-dialog.component';
import { CustomMaterialFormsModule } from '@shared/components/custom-material-forms.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';

@NgModule({
    imports: [
        CustomMaterialFormsModule,
        StandardMaterialModule
    ],
    declarations: [
        OfflineDialogComponent
    ]
})
export class OfflineClientModule {
}
