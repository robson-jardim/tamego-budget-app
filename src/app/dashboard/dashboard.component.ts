import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private afs: AngularFirestore) {
    }

    ngOnInit() {

        // TODO - retrieve budget and account document to get most updated version for route guards

        this.route.params.subscribe(params => {
            const {budgetId} = params;
            this.updateBudgetVisitDate(budgetId);
        });
    }

    private updateBudgetVisitDate(budgetId: string) {
        const currentTime = new Date();
        this.afs.doc(`budgets/${budgetId}`).update({
            lastVisited: currentTime
        });
    }
}
