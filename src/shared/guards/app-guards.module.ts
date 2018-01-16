import { NgModule } from '@angular/core';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { SignedOutGuard } from '@shared/guards/signed-in/signed-in.guard';

@NgModule({
    providers: [
        AuthGuard,
        SignedOutGuard
    ]
})
export class AppGuardsModule {
}
