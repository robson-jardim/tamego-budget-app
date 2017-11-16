import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from "./components/login-signup/login-signup.component";
import { AuthGuard } from "./services/auth-guard/auth.guard";
import { BudgetSelectionComponent } from "./components/budget-selection/budget-selection.component";
import { AccountsComponent } from "./components/accounts/accounts.component";
import { EditBudgetComponent } from "./components/edit-budget/edit-budget.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

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
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'budget',
                pathMatch: 'full'
            },
            {
                path: 'accounts',
                component: AccountsComponent,
            },
            {
                path: 'budget',
                component: EditBudgetComponent,
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
