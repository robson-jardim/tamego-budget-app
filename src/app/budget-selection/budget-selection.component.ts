import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BudgetDialogComponent } from './budget-dialog/budget-dialog.component';
import 'rxjs/add/operator/first';
import { CollectionResult } from '@models/collection-result.model';
import { Budget, BudgetId } from '@models/budget.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { User } from '@models/user.model';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { ObserveOnMessage } from 'rxjs/operators/observeOn';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-dashboard',
    templateUrl: './budget-selection.component.html',
    styleUrls: ['./budget-selection.component.scss'],
})
export class BudgetSelectionComponent implements OnInit {

    public budgets$: Observable<BudgetId[]>

    constructor(private firestore: FirestoreService,
                private router: Router,
                private route: ActivatedRoute,
                public auth: AuthService,
                private dialogService: CloseDialogService) {
    }

    ngOnInit() {
        this.auth.user.first().subscribe(user => {
            this.budgets$ = this.firestore.getBudgets(user.userId).observable;
        });
    }

    public createBudget(): void {

        this.auth.user.first().subscribe((user: User) => {

            const addBudgetDialogRef = this.dialogService.openCreate(BudgetDialogComponent, {
                data: {
                    userId: user.userId
                }
            });

            addBudgetDialogRef.beforeClose().subscribe( newBudgetId => {
                if (newBudgetId) {
                    this.router.navigate([newBudgetId], {relativeTo: this.route});
                }
            });
        });
    }
}

