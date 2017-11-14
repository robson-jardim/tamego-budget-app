import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from "./components/login-signup/login-signup.component";
import { AuthGuard } from "./services/auth-guard/auth.guard";
import { BudgetSelectionComponent } from "./components/budget-selection/budget-selection.component";
import { AccountsComponent } from "./components/accounts/accounts.component";
import { BudgetComponent } from "./components/budget/budget.component";

const routes: Routes = [
    {
        path: 'login',
        component: LoginSignupComponent,
    },
    {
        path: 'budgets',
        // canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: BudgetSelectionComponent
            },
            {
                path: ':budgetId/accounts',
                component: AccountsComponent,
            },
            {
                path: ':budgetId/budget',
                component: BudgetComponent,
            }

        ]
    },
    // {
    //     path: '**',
    //     redirectTo: 'login',
    //     pathMatch: 'full'
    // }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
