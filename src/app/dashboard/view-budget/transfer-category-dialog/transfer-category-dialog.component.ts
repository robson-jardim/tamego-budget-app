import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category, CategoryId } from '@models/category.model';
import { CollectionResult } from '@models/collection-result.model';
import { CategoryGroup, CategoryGroupId } from '@models/category-group.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';

@Component({
    selector: 'app-transfer-category-dialog',
    templateUrl: './transfer-category-dialog.component.html',
    styleUrls: ['./transfer-category-dialog.component.scss']
})
export class TransferCategoryDialogComponent implements OnInit {

    public transferForm: FormGroup;
    public saving = false;

    public category: CategoryId;
    public budgetId: string;

    public groupResult: CollectionResult<CategoryGroup, CategoryGroupId[]>;
    private categoryResult: CollectionResult<Category, CategoryId[]>;

    constructor(private dialogRef: MatDialogRef<TransferCategoryDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private formBuilder: FormBuilder,
                private firestore: FirestoreService) {
        this.category = this.data.category;
        this.budgetId = this.data.budgetId;
    }

    ngOnInit() {
        this.groupResult = this.firestore.getGroups(this.budgetId);
        this.categoryResult = this.firestore.getCategories(this.budgetId);

        this.transferForm = this.formBuilder.group({
            transferTo: [null, Validators.required]
        });
    }

    private close() {
        this.dialogRef.close();
    }

    public transferCategory() {
        this.saving = true;

        const transferId = this.transferForm.value.transferTo;

        if (this.category.groupId === transferId) {
            this.close();
            return;
        }

        this.categoryResult.collection.doc(this.category.categoryId).update({groupId: transferId})
            .then(() => {
                this.close();
            });
    }

}
