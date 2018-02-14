import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
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
            console.log(error);
            // Firebase: missing or insufficient permissions
            return Observable.of(false);
        }).do(ownsBudget => {
            if (!ownsBudget) {
                this.router.navigate(['/budgets']);
            }
        });
    }
}
