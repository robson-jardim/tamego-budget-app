import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BudgetAccount } from '@models/budget-account.model';

@Injectable()
export class BudgetAccountGuard implements CanActivate {

    constructor(private afs: AngularFirestore, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const {accountId} = next.params;
        const {budgetId} = next.parent.params;

        const accountDocument: AngularFirestoreDocument<BudgetAccount> = this.afs.doc(`budgets/${budgetId}/accounts/${accountId}`);

        return accountDocument.snapshotChanges().map(doc => {
            return doc.payload.exists;
        }).catch(error => {
            // Firebase: missing or insufficient permissions
            return Observable.of(false);
        }).do(ownsBudgetAccount => {
            if (!ownsBudgetAccount) {
                this.router.navigate(['/budgets', budgetId]);
            }
        });
    }
}
