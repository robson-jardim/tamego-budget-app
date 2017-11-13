import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from "./components/login-signup/login-signup.component";
import { AuthGuard } from "./services/auth-guard/auth.guard";
import { BudgetComponent } from "./components/budget/budget.component";
import { BudgetSelectionComponent } from "./components/budget-selection/budget-selection.component";

const routes: Routes = [
    {
        path: 'login',
        component: LoginSignupComponent,
    },
    {
        path: 'budgets',
        component: BudgetSelectionComponent,
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
