import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AddBudgetDialogComponent } from '../add-budget-dialog/add-budget-dialog.component';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { CollectionResult } from '../../../../models/collection-result.model';
import { Budget, BudgetId } from '../../../../models/budget.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './budget-selection.component.html',
    styleUrls: ['./budget-selection.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BudgetSelectionComponent implements OnInit {

    public budgets: CollectionResult<Budget, BudgetId[]>;

    constructor(private firestore: FirestoreService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.budgets = this.firestore.getBudgets();
    }

    public openAddNewBudgetDialog(): void {
        const addBudgetDialogRef = this.dialog.open(AddBudgetDialogComponent, {
            data: {
                budgetCollection: this.budgets.collection,
                userId: this.firestore.userId
            }
        });

        addBudgetDialogRef.beforeClose().subscribe(newBudgetId => {
            if (newBudgetId) {
                this.router.navigate([newBudgetId], {relativeTo: this.route});
            }
        });
    }

    public deleteBudget(budget: BudgetId) {
        this.budgets.collection.doc(budget.budgetId).delete();
    }
}

