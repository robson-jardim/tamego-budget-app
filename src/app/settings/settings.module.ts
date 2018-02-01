import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { HeaderModule } from '@shared/components/header/header.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { StandardMaterialModule } from '@shared/components/standard-material.module';

@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        SettingsRoutingModule,
        StandardMaterialModule
    ],
    declarations: [
        SettingsComponent
    ]
})
export class SettingsModule {
}
