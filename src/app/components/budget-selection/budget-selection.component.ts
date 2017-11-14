import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { AuthService, User } from "../../services/auth-service/auth.service";
import { Observable } from "rxjs/Observable";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    templateUrl: './budget-selection.component.html',
    styleUrls: ['./budget-selection.component.scss'],
})
export class BudgetSelectionComponent implements OnInit {

    public newBudget: FormGroup;

    private budgetCollection: AngularFirestoreCollection<Budget>;
    public budgets: Observable<BudgetId[]>;

    private user: User;

    constructor (private db: AngularFirestore, private auth: AuthService, private formBuilder: FormBuilder) {
    }

    ngOnInit () {
        this.auth.user
            .take(1)
            .subscribe(x => {
                this.user = x;
                this.getBudgets();
            });

        this.buildNewBudgetForm();
    }

    private buildNewBudgetForm () {
        this.newBudget = this.formBuilder.group({
            budgetName: ['', Validators.required],
            currencyType: ['', Validators.required]
        });
    }


    public getBudgets (): void {
        this.budgetCollection = this.db.collection<Budget>('budgets', ref => ref.where('userId', '==', this.user.userId));

        this.budgets = this.budgetCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Budget;
                const budgetId = a.payload.doc.id;
                return {budgetId, ...data};
            })
        });
    }

    public addBudget (formValues): void {

        if (this.newBudget.valid) {
            const budget: Budget = {
                userId: this.user.userId,
                budgetName: formValues.budgetName,
                currencyType: formValues.currencyType
            };

            this.budgetCollection.add(budget);
        }
    }

    public deleteBudget(budget: BudgetId) {
        this.budgetCollection.doc(budget.budgetId).delete();
    }


}

interface Budget {
    userId: string,
    budgetName: string,
    currencyType: string
}

interface BudgetId extends Budget {
    budgetId: string;
}
