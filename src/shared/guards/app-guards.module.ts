import { NgModule } from '@angular/core';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { SignedOutGuard } from '@shared/guards/signed-in/signed-in.guard';
import { BudgetGuard } from '@shared/guards/budget/budget.guard';
import { BudgetAccountGuard } from '@shared/guards/budget-account/budget-account.guard';

@NgModule({
    providers: [
        AuthGuard,
        SignedOutGuard,
        BudgetGuard,
        BudgetAccountGuard
    ]
})
export class AppGuardsModule {
}
