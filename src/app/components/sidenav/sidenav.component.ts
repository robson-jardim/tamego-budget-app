import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AddAccountToBudgetDialogComponent } from "../add-account-to-budget-dialog/add-account-to-budget-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Account, DatabaseService } from "../../services/database/database.service";
import { Observable } from "rxjs/Observable";
import { AngularFirestoreCollection } from "angularfire2/firestore";

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

    private budgetAccountCollection: AngularFirestoreCollection<Account>;
    public budgetAccounts: Observable<Account[]>;
    private budgetId: string;

    constructor(private dialog: MatDialog,
                private db: DatabaseService,
                private route: ActivatedRoute,
                private router: Router) {
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

        const addAccountToBudgetDialogRef = this.dialog.open(AddAccountToBudgetDialogComponent, {
            data: {
                budgetAccountCollection: this.budgetAccountCollection,
                budgetId: this.budgetId,
                userId: this.db.userId
            }
        });

        addAccountToBudgetDialogRef.beforeClose().subscribe(newAccountId => {
            if (newAccountId) {
                this.router.navigate(['./accounts', newAccountId], {relativeTo: this.route});
            }
        });
    }

}
