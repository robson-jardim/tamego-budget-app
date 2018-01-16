import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { AppPipesModule } from '@shared/pipes/app-pipes.module';
import { HeaderModule } from '@shared/components/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        AppPipesModule
    ],
    declarations: [
        SettingsComponent
    ]
})
export class SettingsModule {
}
