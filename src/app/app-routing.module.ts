import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from "./components/login-signup/login-signup.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { AuthGuard } from "./core/auth.guard";

const routes: Routes = [
    {
        path: '',
        component: LoginSignupComponent,
    },
    {
        path:'budgets',
        component: UserProfileComponent,
        canActivate: [AuthGuard]

    },
    {
        path:'budgets/:budgetId',
        component: UserProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '',
        pathMath: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
