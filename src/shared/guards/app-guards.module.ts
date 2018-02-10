import { NgModule } from '@angular/core';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { SignedOutGuard } from '@shared/guards/signed-in/signed-in.guard';
import { BudgetGuard } from '@shared/guards/budget/budget.guard';
import { BudgetAccountGuard } from '@shared/guards/budget-account/budget-account.guard';
import { PremiumGuard } from '@shared/guards/premium/premium.guard';

@NgModule({
    providers: [
        AuthGuard,
        SignedOutGuard,
        BudgetGuard,
        BudgetAccountGuard,
        PremiumGuard
    ]
})
export class AppGuardsModule {
}
