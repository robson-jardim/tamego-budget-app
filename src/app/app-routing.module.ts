import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from "./components/login-signup/login-signup.component";
import { AuthGuard } from "./services/auth-guard/auth.guard";
import { BudgetSelectionComponent } from "./components/budget-selection/budget-selection.component";
import { AccountsComponent } from "./components/accounts/accounts.component";
import { EditBudgetComponent } from "./components/edit-budget/edit-budget.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TestingComponent } from "./components/testing/testing.component";

const routes: Routes = [
    {
        path: '',
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
                path: 'budget',
                component: EditBudgetComponent,
            },
            {
                path: 'accounts',
                component: AccountsComponent,
            },
            {
                path: 'accounts/:accountId',
                component: AccountsComponent
            }
        ]
    },
    {
        path: 'testing',
        component: TestingComponent,
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
