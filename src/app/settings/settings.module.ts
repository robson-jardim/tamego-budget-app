import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '@shared/components/header/header.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { SettingsComponent } from './settings.component';

@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        StandardMaterialModule
    ],
    declarations: [
        SettingsComponent
    ]
})
export class SettingsModule {
}
