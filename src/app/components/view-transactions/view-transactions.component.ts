import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FirestoreService } from '../../services/firestore/firestore.service';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-budget',
    templateUrl: './view-transactions.component.html',
    styleUrls: ['./view-transactions.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ViewTransactionsComponent implements OnInit {

    public transactions;

    constructor(private route: ActivatedRoute,
                private firstore: FirestoreService) {
    }

    ngOnInit() {

        Observable.combineLatest(this.getBudgetId(), this.getAccountId()).subscribe(([budgetId, accountId]) => {

            this.transactions = this.firstore.getTransactionView(budgetId, accountId);

            this.transactions.subscribe(x => {
                console.log(x);
            });
        });
    }

    private getAccountId(): Observable<string> {
        return this.route.params.map(params => {
            return params.accountId;
        });
    }

    private getBudgetId(): Observable<string> {
        return this.route.parent.params.map(params => {
            return params.budgetId;
        });
    }

}
