import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardMaterialModule } from '@shared/components/standard-material.module';
import { AppHeaderModule } from '@shared/components/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { SignedOutGuard } from '@shared/guards/signed-in/signed-in.guard';
import { StartDemoComponent } from './start-demo.component';
import { DemoService } from './demo/demo.service';

const routes: Routes = [
    {
        path: '',
        component: StartDemoComponent,
        canActivate: [SignedOutGuard]
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
        StartDemoComponent
    ]
})
export class DemoModule {
}
