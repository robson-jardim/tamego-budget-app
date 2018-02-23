import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CategoryId } from '@models/category.model';
import { CategoryWithValues } from '@models/view-budget.model';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { CategoryValueId } from '@models/category-value.model';

export interface DesiredValue extends CategoryValueId {
    exists: boolean;
}

export interface CategoryWithDesiredValue extends CategoryWithValues {
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


    @Input() categories: CategoryWithValues[];
    @Input() viewMonth: Date;
    @Input() budgetId: string;

    @Input() onChanges$;
    public columns = ['categoryName', 'budgeted', 'activity', 'available', 'actions'];
    public dataSource: CategoryWithDesiredValue[];
    public hoveredTableRow = -1;
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

    public highlight(row) {
        this.hoveredTableRow = row.categoryId;
    }

    public unhighlight(row) {
        this.hoveredTableRow = -1;
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

            return {
                offsetTotalToDate,
                budgetedTotalToDate,
                desiredValue,
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
}



