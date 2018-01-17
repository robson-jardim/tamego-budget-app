import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { HeaderModule } from '@shared/components/header/header.module';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        SettingsRoutingModule
    ],
    declarations: [
        SettingsComponent
    ]
})
export class SettingsModule {
}
