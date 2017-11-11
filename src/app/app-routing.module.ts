import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from "./components/login-signup/login-signup.component";
import { AuthGuard } from "./services/auth-guard/auth.guard";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { BudgetComponent } from "./components/budget/budget.component";

const routes: Routes = [
    {
        path: 'login',
        component: LoginSignupComponent,
    },
    {
        path: 'budgets',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'budgets/:budgetId',
        component: BudgetComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
