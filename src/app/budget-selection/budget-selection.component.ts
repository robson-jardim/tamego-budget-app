import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetDialogComponent } from './budget-dialog/budget-dialog.component';
import 'rxjs/add/operator/first';
import { BudgetId } from '@models/budget.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { TemporaryStartupUser, User } from '@models/user.model';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
    selector: 'app-dashboard',
    templateUrl: './budget-selection.component.html',
    styleUrls: ['./budget-selection.component.scss'],
})
export class BudgetSelectionComponent implements OnInit {

    public budgets$: Observable<BudgetId[]>;

    constructor(private firestore: FirestoreService,
                private router: Router,
                private route: ActivatedRoute,
                public auth: AuthService,
                private dialogService: CloseDialogService) {
    }

    ngOnInit() {
        this.budgets$ = this.auth.user.first().flatMap(user => {
            return this.firestore.getBudgets(user.userId).observable;
        });
    }

    public createBudget(): void {

        this.auth.user.first().subscribe((user: User) => {

            const addBudgetDialogRef = this.dialogService.openCreate(BudgetDialogComponent, {
                data: {
                    userId: user.userId
                }
            });

            addBudgetDialogRef.beforeClose().subscribe(newBudgetId => {
                if (newBudgetId) {
                    this.router.navigate([newBudgetId], {relativeTo: this.route});
                }
            });
        });
    }
}

