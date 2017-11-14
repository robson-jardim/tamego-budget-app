import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService, User } from '../../services/auth-service/auth.service';
import { Observable } from 'rxjs/Observable';
import { AddBudgetDialogComponent } from '../add-budget-dialog/add-budget-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-dashboard',
    templateUrl: './budget-selection.component.html',
    styleUrls: ['./budget-selection.component.scss'],
})
export class BudgetSelectionComponent implements OnInit {

    private budgetCollection: AngularFirestoreCollection<Budget>;
    public budgets: Observable<BudgetId[]>;
    private user: User;

    constructor(private db: AngularFirestore,
                private auth: AuthService,
                private dialog: MatDialog,
                private router: Router,
                public route: ActivatedRoute) {
    }

    openAddNewBudgetDialog(): void {
        const addBudgetDialogRef = this.dialog.open(AddBudgetDialogComponent, {
            data: {
                budgetCollection: this.budgetCollection,
                userId: this.user.userId
            }
        });

        addBudgetDialogRef.afterClosed().subscribe(newBudgetId => {
            if (newBudgetId) {
                this.router.navigate([newBudgetId, 'budget'], { relativeTo: this.route });
            }
        });
    }

    ngOnInit() {
        this.auth.user
            .take(1)
            .subscribe(x => {
                this.user = x;
                this.getBudgets();
            });
    }

    public getBudgets(): void {
        this.budgetCollection = this.db.collection<Budget>('budgets', ref => ref.where('userId', '==', this.user.userId));

        this.budgets = this.budgetCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Budget;
                const budgetId = a.payload.doc.id;
                return {budgetId, ...data};
            });
        });
    }


    public deleteBudget(budget: BudgetId) {
        this.budgetCollection.doc(budget.budgetId).delete();
    }

}

export interface Budget {
    userId: string;
    budgetName: string;
    currencyType: string;
}

export interface BudgetId extends Budget {
    budgetId: string;
}
