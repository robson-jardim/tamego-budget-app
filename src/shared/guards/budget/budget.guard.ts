import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Budget } from '@models/budget.model';

@Injectable()
export class BudgetGuard implements CanActivate {

    constructor(private afs: AngularFirestore, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        const {budgetId} = next.params;
        const budgetDocument: AngularFirestoreDocument<Budget> = this.afs.doc(`budgets/${budgetId}`);

        return budgetDocument.snapshotChanges().map(doc => {
            return doc.payload.exists;
        }).catch(error => {
            if (error.code !== 'permission-denied') {
                console.log(error);
            }

            return Observable.of(false);
        }).do(ownsBudget => {
            if (!ownsBudget) {
                this.router.navigate(['/budgets'], {replaceUrl: true});
            }
        });
    }
}
