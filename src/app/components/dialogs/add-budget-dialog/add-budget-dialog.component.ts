import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Budget, BudgetId } from '../../../../../models/budget.model';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import 'rxjs/add/operator/retry';
import { CollectionResult } from "../../../../../models/collection-result.model";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/of";
import "rxjs/add/observable/merge";
import { CategoryGroup, CategoryGroupId } from "../../../../../models/category-group.model";

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
        // Retrying like this creates a lot of network overhead
        const groups: CollectionResult<CategoryGroup, CategoryGroupId[]> = this.firestore.getGroups(budgetId);
        groups.collection.valueChanges().retry().first().subscribe(() => {
            this.onBudgetAdded(budgetId);
        });
    }

    private onBudgetAdded(budgetId: string): void {
        this.dialogRef.close(budgetId);
    }
}
