import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo.component';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: DemoComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        StandardMaterialModule,
        AppHeaderModule,

        RouterModule.forChild(routes)
    ],
    declarations: [
        DemoComponent
    ]
})
export class DemoModule {
}
