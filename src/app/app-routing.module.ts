import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { SignedOutGuard } from '@shared/guards/signed-in/signed-in.guard';

import { LoginSignupComponent } from './login-signup/login-signup.component';
import { BudgetSelectionComponent } from './budget-selection/budget-selection.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
    {
        path: '**',
        redirectTo: '', // Redirects to login page
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
