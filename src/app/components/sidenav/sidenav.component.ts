import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddAccountToBudgetDialogComponent } from '../add-account-to-budget-dialog/add-account-to-budget-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BudgetAccount } from '../../../../models/budget-account.model';
import { FirestoreReferenceService } from '../../services/firestore-reference/firestore-reference.service';
import { FormatFirestoreDataService } from '../../services/format-firestore-data/format-firestore-data.service';

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
                private firestoreRef: FirestoreReferenceService,
                private formatFirestoreData: FormatFirestoreDataService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.route.params
            .subscribe(params => {
                this.budgetId = params.budgetId;
                this.budgetAccountCollection = this.firestoreRef.getBudgetAccountCollectionRef(this.budgetId);
                this.budgetAccounts = this.formatFirestoreData.setBudgetAccountIds(this.budgetAccountCollection);
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
