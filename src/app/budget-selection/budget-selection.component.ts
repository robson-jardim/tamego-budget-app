import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddBudgetDialogComponent } from './add-budget-dialog/add-budget-dialog.component';
import 'rxjs/add/operator/first';
import { CollectionResult } from '@models/collection-result.model';
import { Budget, BudgetId } from '@models/budget.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './budget-selection.component.html',
    styleUrls: ['./budget-selection.component.scss'],
})
export class BudgetSelectionComponent implements OnInit {

    public budgets: CollectionResult<Budget, BudgetId[]>;

    constructor(private firestore: FirestoreService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute,
                public auth: AuthService) {
    }

    ngOnInit() {
        this.auth.user.first().subscribe(user => {
            this.budgets = this.firestore.getBudgets(user.userId);
        });
    }

    public openAddNewBudgetDialog(): void {

        this.auth.user.first().subscribe((user: User) => {

            const addBudgetDialogRef = this.dialog.open(AddBudgetDialogComponent, {
                data: {
                    budgets: this.budgets,
                    userId: user.userId
                }
            });

            addBudgetDialogRef.beforeClose().subscribe(async newBudgetId => {
                if (newBudgetId) {
                    await this.router.navigate([newBudgetId], {relativeTo: this.route});
                }
            });

        });
    }

}

