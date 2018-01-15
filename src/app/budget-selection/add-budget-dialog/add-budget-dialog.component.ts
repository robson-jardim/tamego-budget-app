import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/retry';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/observable/timer';
import { CollectionResult } from '@models/collection-result.model';
import { Budget, BudgetId } from '@models/budget.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';

@Component({
    selector: 'app-add-budget-dialog',
    templateUrl: './add-budget-dialog.component.html',
    styleUrls: ['./add-budget-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddBudgetDialogComponent implements OnInit {

    public budgetForm: FormGroup;

    private budgets: CollectionResult<Budget, BudgetId[]>;
    private userId: string;

    public saving = false;

    constructor(private dialogRef: MatDialogRef<AddBudgetDialogComponent>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private firestore: FirestoreService,
                private afs: AngularFirestore) {
        this.budgets = data.budgets;
        this.userId = data.userId;
    }

    ngOnInit() {
        this.buildBudgetForm();
    }

    private buildBudgetForm(): void {
        this.budgetForm = this.formBuilder.group({
            budgetName: ['', Validators.required]
        });
    }

    public async addBudget() {

        this.saving = true;

        const data: Budget = {
            userId: this.data.userId,
            budgetName: this.budgetForm.value.budgetName,
            createdAt: FirestoreService.currentTimestamp
        };

        const budgetCollection = this.budgets.collection;
        const budgetId = this.firestore.generateId();
        budgetCollection.doc(budgetId).set(data);

        // This is a work around for the get() issue with Firestore security rules.
        // Once Firebase fixes the issue, this will no longer be needed.
        // LINK: https://stackoverflow.com/questions/47818878/firestore-rule-failing-while-using-get-on-newly-created-documents
        const groupsObservable = this.firestore.getGroups(budgetId).collection.valueChanges();
        groupsObservable.retryWhen(errors => errors.delayWhen(() => Observable.timer(1000))).first().subscribe(() => {
            this.onBudgetAdded(budgetId);
        });
    }

    private onBudgetAdded(budgetId: string): void {
        this.dialogRef.close(budgetId);
    }
}
