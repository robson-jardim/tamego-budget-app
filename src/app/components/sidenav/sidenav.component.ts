import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AddAccountToBudgetDialogComponent } from "../add-account-to-budget-dialog/add-account-to-budget-dialog.component";
import { ActivatedRoute } from "@angular/router";
import { BudgetAccount, DatabaseService } from "../../services/database/database.service";
import { Observable } from "rxjs/Observable";
import { AngularFirestoreCollection } from "angularfire2/firestore";

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

    private budgetAccountCollection: AngularFirestoreCollection<BudgetAccount>
        public budgetAccounts: Observable<BudgetAccount[]>;
    private budgetId: string;

    constructor(private dialog: MatDialog,
                private route: ActivatedRoute,
                private db: DatabaseService) {
    }

    ngOnInit() {
        this.route.params
            .subscribe(params => {
                this.budgetId = params.budgetId;
                this.budgetAccountCollection = this.db.getBudgetAccountCollection(this.budgetId);
                this.budgetAccounts = this.db.getBudgetAccountsWithIds(this.budgetAccountCollection);
            });
    }

    public openAddBudgetToAccountDialog() {

        const addBudgetDialogRef = this.dialog.open(AddAccountToBudgetDialogComponent, {
            data: {
                budgetAccountCollection: this.budgetAccountCollection,
                budgetId: this.budgetId,
                userId: this.db.userId
            }
        });

        addBudgetDialogRef.afterClosed().subscribe(newAccountId => {
            if (newAccountId) {
            }
        });
    }

}
