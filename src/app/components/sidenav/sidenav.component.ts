import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddAccountToBudgetDialogComponent } from '../add-account-to-budget-dialog/add-account-to-budget-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BudgetAccount, BudgetAccountId } from '../../../../models/budget-account.model';
import { FirestoreReferenceService } from '../../services/firestore-reference/firestore-reference.service';
import { CollectionResult } from '../../../../models/collection-result.model';
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

    public budgetAccounts: CollectionResult<BudgetAccount, BudgetAccountId[]>;


    constructor(private dialog: MatDialog,
                private firestoreRef: FirestoreReferenceService,
                private route: ActivatedRoute,
                private router: Router,
                private firestore: FirestoreService) {
    }

    ngOnInit() {
        this.route.params
            .subscribe(params => {
                const budgetId = params.budgetId;
                this.budgetAccounts = this.firestore.getBudgetAccounts(budgetId);
            });
    }

    public openAddBudgetToAccountDialog() {
        const addAccountToBudgetDialogRef = this.dialog.open(AddAccountToBudgetDialogComponent, {
            data: {
                budgetAccountCollection: this.budgetAccounts.collection
            }
        });

        addAccountToBudgetDialogRef.beforeClose().subscribe(newAccountId => {
            if (newAccountId) {
                this.router.navigate(['./accounts', newAccountId], {relativeTo: this.route});
            }
        });
    }

}
