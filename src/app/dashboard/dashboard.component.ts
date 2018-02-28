import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    public mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    public initialSidenavState;

    constructor(private route: ActivatedRoute,
                private afs: AngularFirestore,
                private changeDetectorRef: ChangeDetectorRef,
                private media: MediaMatcher) {

        this.mobileQuery = media.matchMedia('(max-width: 920px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.initialSidenavState = this.mobileQuery.matches ? false : true;
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

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    test(x) {
        console.log(x);
    }

}
