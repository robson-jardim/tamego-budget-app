import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../../services/auth-service/auth.service';
import { Observable } from 'rxjs/Observable';
import { AddBudgetDialogComponent } from '../add-budget-dialog/add-budget-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from "@angular/router";
import { Budget, BudgetId, DatabaseService } from "../../services/database/database.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './budget-selection.component.html',
    styleUrls: ['./budget-selection.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BudgetSelectionComponent implements OnInit {

    private budgetCollection: AngularFirestoreCollection<Budget>;
    public budgets: Observable<BudgetId[]>;

    constructor(private auth: AuthService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute,
                private db: DatabaseService) {
    }

    ngOnInit() {
        this.budgetCollection = this.db.getBudgetCollection();
        this.budgets = this.db.getBudgetsWithIds(this.budgetCollection);

        this.db.getBudgetsWithIds(this.budgetCollection).subscribe(x => console.log);
    }

    public openAddNewBudgetDialog(): void {
        const addBudgetDialogRef = this.dialog.open(AddBudgetDialogComponent, {
            data: {
                budgetCollection: this.budgetCollection,
                userId: this.db.userId
            }
        });

        addBudgetDialogRef.afterClosed().subscribe(newBudgetId => {
            if (newBudgetId) {
                this.router.navigate([newBudgetId, 'accounts'], { relativeTo: this.route });
            }
        });
    }

    public deleteBudget(budget) {
        this.budgetCollection.doc(budget.budgetId).delete();
    }
}

