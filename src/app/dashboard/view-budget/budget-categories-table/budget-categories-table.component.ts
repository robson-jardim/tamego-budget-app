import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CategoryId } from '@models/category.model';
import { CategoryWithValues } from '@models/view-budget.model';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { CategoryValueId } from '@models/category-value.model';
import { ReoccurringTransferId, TransferId } from '@models/transfer.model';
import { instanceOfTransactionId, ReoccurringTransactionId, TransactionId } from '@models/transaction.model';

type Activity = number;
type PastActivity = number;

export interface DesiredValue extends CategoryValueId {
    exists: boolean;
}

export interface CategoryWithDesiredValue extends CategoryWithValues {
    activity: Activity;
    pastActivityTotal: PastActivity;
    offsetTotalToDate: number;
    budgetedTotalToDate: number;
    desiredValue: DesiredValue;
}

@Component({
    selector: 'app-budget-categories-table',
    templateUrl: './budget-categories-table.component.html',
    styleUrls: ['./budget-categories-table.component.scss']
})
export class BudgetCategoriesTableComponent implements OnInit, OnChanges, OnDestroy {

    @Input() transactions: Array<TransactionId | TransferId | ReoccurringTransactionId | ReoccurringTransferId>;
    @Input() categories: CategoryWithValues[];
    @Input() budgetId: string;

    @Input() viewMonth: Date;
    @Input() onChanges$;

    public columns = ['categoryName', 'budgeted', 'activity', 'available', 'actions'];
    public dataSource: CategoryWithDesiredValue[];
    public changeSubscription: Subscription;

    constructor(private dialogService: CloseDialogService) {
    }

    ngOnInit() {
        // Angular change detection does not check deep nesting of objects (e.g. values inside categories).
        // Changes must be listened to in order to show the most updated data
        this.changeSubscription = this.onChanges$.subscribe(() => {
            this.buildDataSource();
        });
    }

    ngOnDestroy() {
        this.changeSubscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.viewMonth) {
            this.buildDataSource();
        }
    }

    public trackCategories(index, category: CategoryId) {
        return category ? category.categoryId : undefined;
    }

    private buildDataSource() {

        this.dataSource = this.categories.map(category => {

            const isOnOrBeforeViewMonth = (value) => {
                return value.budgetMonth <= this.viewMonth;
            };

            const isOnViewMonth = (value) => {
                // Does equality check on dates to make sure they are equal
                return value.budgetMonth <= this.viewMonth && value.budgetMonth >= this.viewMonth;
            };

            const sum = (prev, next) => {
                return prev + next;
            };

            const budgeted = (value) => {
                return value.budgeted;
            };

            const offset = (value) => {
                return value.offset;
            };

            const offsetTotalToDate = category.values.filter(isOnOrBeforeViewMonth).map(offset).reduce(sum, 0);
            const budgetedTotalToDate = category.values.filter(isOnOrBeforeViewMonth).map(budgeted).reduce(sum, 0);

            const [currentCategoryValue]: CategoryValueId[] = category.values.filter(isOnViewMonth);
            let desiredValue: DesiredValue;

            if (!currentCategoryValue) {
                desiredValue = {
                    categoryValueId: null,
                    exists: false,
                    categoryId: category.categoryId,
                    budgeted: 0,
                    offset: 0,
                    budgetMonth: this.viewMonth,
                };
            }
            else {
                desiredValue = {
                    ...currentCategoryValue,
                    exists: true
                };
            }


            const activity = this.getActivity(category);
            const pastActivityTotal = this.getPastActivity(category);

            return {
                offsetTotalToDate,
                budgetedTotalToDate,
                desiredValue,
                activity,
                pastActivityTotal,
                ...category
            };
        });

    }

    public updateCategory(category: CategoryId) {
        const nextCategoryPosition = this.categories.length;

        this.dialogService.openUpdate(CategoryDialogComponent, {
            data: {
                ...category,
                budgetId: this.budgetId,
                nextCategoryPosition
            }
        });
    }

    private getActivity(category: CategoryWithValues): Activity {
        const nextViewMonth = new Date(Date.UTC(this.viewMonth.getUTCFullYear(), this.viewMonth.getUTCMonth() + 1));

        return this.transactions
            .filter(instanceOfTransactionId)
            .filter(x => category.categoryId === (<TransactionId>x).categoryId)
            .filter(x => this.viewMonth <= x.transactionDate && x.transactionDate < nextViewMonth)
            .reduce((activity, transaction) => activity + transaction.amount, 0);
    }

    private getPastActivity(category: CategoryWithValues): PastActivity {
        return this.transactions
            .filter(instanceOfTransactionId)
            .filter(x => category.categoryId === (<TransactionId>x).categoryId)
            .filter(x => x.transactionDate < this.viewMonth)
            .reduce((activity, transaction) => activity + transaction.amount, 0);
    }
}
