import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionResult } from '@models/collection-result.model';
import { BudgetAccount, BudgetAccountId } from '@models/budget-account.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

    public budgetAccounts: CollectionResult<BudgetAccount, BudgetAccountId[]>;

    constructor(private dialog: MatDialog,
                private route: ActivatedRoute,
                private router: Router,
                private firestore: FirestoreService) {
    }

    ngOnInit() {
        this.route.params
            .subscribe(params => {
                const budgetId = params.budgetId;
                this.budgetAccounts = this.firestore.getAccounts(budgetId);
            });
    }

    public openAddBudgetToAccountDialog() {
        const addAccountToBudgetDialogRef = this.dialog.open(AccountDialogComponent, {
            data: {
                budgetAccountCollection: this.budgetAccounts.collection
            }
        });

        addAccountToBudgetDialogRef.beforeClose().subscribe(newAccountId => {
            if (newAccountId) {
                this.router.navigate(['accounts', newAccountId], {relativeTo: this.route});
            }
        });
    }

    public updateAccount(account: BudgetAccountId) {
        // TODO - update dialog from sidenav
    }
}
