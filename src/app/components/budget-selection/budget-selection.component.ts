import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../../services/auth-service/auth.service';
import { Observable } from 'rxjs/Observable';
import { AddBudgetDialogComponent } from '../add-budget-dialog/add-budget-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget } from '../../../../models/budget.model';
import { FirestoreReferenceService } from '../../services/firestore-reference/firestore-reference.service';
import { CollectionResult } from '../../../../models/collection-result.model';
import { MapFirestoreDocumentIdService } from '../../services/map-firestore-document-id/map-firestore-docoument-id.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './budget-selection.component.html',
    styleUrls: ['./budget-selection.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BudgetSelectionComponent implements OnInit {

    budgets;

    constructor(private auth: AuthService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute,
                private firestoreRef: FirestoreReferenceService,
                private formatFirestoreData: MapFirestoreDocumentIdService) {
    }

    ngOnInit() {
        const budgetCollection = this.firestoreRef.getBudgetCollectionRef();
        const budgetObservable = this.formatFirestoreData.mapBudgetIds(budgetCollection);

        this.budgets = {
            collection: budgetCollection,
            observable: budgetObservable
        };
    }

    public openAddNewBudgetDialog(): void {
        const addBudgetDialogRef = this.dialog.open(AddBudgetDialogComponent, {
            data: {
                budgetCollection: this.budgets.collection,
                userId: this.firestoreRef.userId
            }
        });

        addBudgetDialogRef.beforeClose().subscribe(newBudgetId => {
            if (newBudgetId) {
                this.router.navigate([newBudgetId], {relativeTo: this.route});
            }
        });
    }

    public deleteBudget(budget) {
        this.budgets.collection.doc(budget.id).delete();
    }
}

