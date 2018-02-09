import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CollectionResult } from '@models/collection-result.model';
import { Budget, BudgetId } from '@models/budget.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { first, retryWhen } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

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
        const currentTime = new Date();

        const data: Budget = {
            userId: this.data.userId,
            budgetName: this.budgetForm.value.budgetName,
            timeCreated: currentTime,
            lastVisited: currentTime
        };

        const budgets = this.budgets.collection;
        const budgetId = this.firestore.generateId();
        budgets.doc(budgetId).set(data);

        // This is a work around for an issue with get() inside the Firestore security rules.
        // The bug occurs when trying to access sub-collections on newly created documents.
        // Retry query sub-collections until they emit a value successfully. Only
        // then is is safe to query sub-collections without getting a permission denied error.
        // LINK: https://stackoverflow.com/questions/47818878/firestore-rule-failing-while-using-get-on-newly-created-documents
        const groups = this.firestore.getGroups(budgetId).collection.valueChanges();
        groups.pipe(
            retryWhen(permissionDenied),
            first()
        ).subscribe(() => {
            this.onBudgetAdded(budgetId);
        });

        function permissionDenied(errors) {
            return errors;
        }
    }

    private onBudgetAdded(budgetId: string): void {
        this.dialogRef.close(budgetId);
    }
}
