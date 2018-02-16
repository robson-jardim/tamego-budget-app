import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetAccountId } from '@models/budget-account.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {

    public accounts$: Observable<BudgetAccountId[]>;

    @Output() onSidenavSelection: EventEmitter<any> = new EventEmitter<any>();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private firestore: FirestoreService,
                private dialogService: CloseDialogService) {
    }

    ngOnInit() {
        this.getBudgetId().subscribe(budgetId => {
            this.accounts$ = this.getAccounts(budgetId);
        });
    }

    private getBudgetId(): Observable<string> {
        return this.route.params.map(params => {
            const {budgetId} = params;
            return budgetId;
        }).first();
    }

    private getAccounts(budgetId: string): Observable<BudgetAccountId[]> {
        return this.firestore.getAccounts(budgetId).observable;
    }

    public createAccount() {
        this.getBudgetId().flatMap(budgetId => {

            const dialogRef = this.dialogService.openCreate(AccountDialogComponent, {
                data: {
                    budgetId
                }
            });

            return dialogRef.afterClosed();

        }).first().subscribe(newAccountId => {
            if (newAccountId) {
                this.router.navigate(['accounts', newAccountId], {relativeTo: this.route});
            }
        });
    }

    private onAddNavigateToAccount(dialogRef: MatDialogRef<any>): Observable<any> {
        return dialogRef.afterClosed().filter(id => id !== null);

        function isAccountId(id: string) {
            return id === null;
        }
    }

    public updateAccount(account: BudgetAccountId) {
        this.getBudgetId().subscribe(budgetId => {

            const dialogRef = this.dialogService.openUpdate(AccountDialogComponent, {
                data: {
                    ...account,
                    budgetId
                }
            });

        });
    }

    public sidenavSelection() {
        this.onSidenavSelection.emit();
    }
}
