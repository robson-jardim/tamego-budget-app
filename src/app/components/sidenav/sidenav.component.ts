import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddAccountToBudgetDialogComponent } from '../add-account-to-budget-dialog/add-account-to-budget-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BudgetAccount } from '../../../../models/budget-account.model';
import { FirebaseReferenceService } from '../../services/firebase-reference/firebase-reference.service';
import { FormatFirebaseDataService } from '../../services/format-firebase-data/format-firebase-data.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

    private budgetAccountCollection: AngularFirestoreCollection<BudgetAccount>;
    public budgetAccounts: Observable<BudgetAccount[]>;
    private budgetId: string;

    constructor(private dialog: MatDialog,
                private db: FirebaseReferenceService,
                private formatFirebaseData: FormatFirebaseDataService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.route.params
            .subscribe(params => {
                this.budgetId = params.budgetId;
                this.budgetAccountCollection = this.db.getBudgetAccountCollection(this.budgetId);
                this.budgetAccounts = this.formatFirebaseData.assignIdsToDocumentsInCollection(this.budgetAccountCollection);
            });
    }

    public openAddBudgetToAccountDialog() {

        const addAccountToBudgetDialogRef = this.dialog.open(AddAccountToBudgetDialogComponent, {
            data: {
                budgetAccountCollection: this.budgetAccountCollection
            }
        });

        addAccountToBudgetDialogRef.beforeClose().subscribe(newAccountId => {
            if (newAccountId) {
                this.router.navigate(['./accounts', newAccountId], {relativeTo: this.route});
            }
        });
    }

}
