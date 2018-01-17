import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignedOutGuard } from '@shared/guards/signed-in/signed-in.guard';
import { LoginSignupComponent } from './login-signup.component';

const routes: Routes = [
    {
        path: '',
        component: LoginSignupComponent,
        canActivate: [SignedOutGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginSigupRoutingModule {
}
