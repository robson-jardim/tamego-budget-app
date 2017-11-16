import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AddAccountToBudgetDialogComponent } from "../add-account-to-budget-dialog/add-account-to-budget-dialog.component";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

    budgetAccountCollection;

    constructor (private dialog: MatDialog, private route: ActivatedRoute) {
    }

    ngOnInit () {
    }

    public openAddBudgetToAccountDialog () {
        this.route.params
            .subscribe(params => {

                const budgetId = params.budgetId;

                const addBudgetDialogRef = this.dialog.open(AddAccountToBudgetDialogComponent, {
                    data: {
                        budgetAccountCollection: this.budgetAccountCollection,
                        budgetId: budgetId
                    }
                });

                addBudgetDialogRef.afterClosed().subscribe(newAccountId => {
                    if (newAccountId) {
                    }
                });
            });
    }

}
