import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../../services/auth-service/auth.service';
import { Observable } from 'rxjs/Observable';
import { AddBudgetDialogComponent } from '../add-budget-dialog/add-budget-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget } from '../../../../models/budget.model';
import { FirebaseReferenceService } from '../../services/firebase-reference/firebase-reference.service';
import { FormatFirebaseDataService, FireStoreData } from '../../services/format-firebase-data/format-firebase-data.service';



@Component({
    selector: 'app-dashboard',
    templateUrl: './budget-selection.component.html',
    styleUrls: ['./budget-selection.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BudgetSelectionComponent implements OnInit {

    budgets: FireStoreData<Budget>; 

    constructor(private auth: AuthService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private db: FirebaseReferenceService,
        private formatFirebaseData: FormatFirebaseDataService) {
    }

    ngOnInit() {
        let budgetCollection = this.db.getBudgetCollection();
        let budgetObservable = this.formatFirebaseData.assignIdsToDocumentsInCollection<Budget>(budgetCollection);

        this.budgets = {
            collection: budgetCollection,
            observable: budgetObservable
        }
    }

    public openAddNewBudgetDialog(): void {
        const addBudgetDialogRef = this.dialog.open(AddBudgetDialogComponent, {
            data: {
                budgetCollection: this.budgets.collection,
                userId: this.db.userId
            }
        });

        addBudgetDialogRef.beforeClose().subscribe(newBudgetId => {
            if (newBudgetId) {
                this.router.navigate([newBudgetId], { relativeTo: this.route });
            }
        });
    }

    public deleteBudget(budget) {
        this.budgets.collection.doc(budget.id).delete();
    }
}

