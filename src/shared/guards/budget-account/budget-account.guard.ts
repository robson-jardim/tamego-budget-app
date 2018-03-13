import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Account } from '@models/budget-account.model';

@Injectable()
export class BudgetAccountGuard implements CanActivate {

    constructor(private afs: AngularFirestore, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const {accountId} = next.params;
        const {budgetId} = next.parent.params;
        const accountDocument: AngularFirestoreDocument<Account> = this.afs.doc(`budgets/${budgetId}/accounts/${accountId}`);

        return accountDocument.snapshotChanges().map(doc => {
            return doc.payload.exists;
        }).catch(error => {
            if (error.code !== 'permission-denied') {
                console.log(error);
            }

            return Observable.of(false);
        }).do(ownsBudgetAccount => {
            if (!ownsBudgetAccount) {
                this.router.navigate(['/budgets', budgetId], {replaceUrl: true});
            }
        });
    }
}
