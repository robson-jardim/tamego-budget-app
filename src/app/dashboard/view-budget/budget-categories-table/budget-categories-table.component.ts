import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CategoryId } from '@models/category.model';
import { EditCategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { MatDialog } from '@angular/material';
import { CategoryWithValues } from '@models/view-budget.model';

@Component({
    selector: 'app-budget-categories-table',
    templateUrl: './budget-categories-table.component.html',
    styleUrls: ['./budget-categories-table.component.scss']
})
export class BudgetCategoriesTableComponent implements OnInit, OnChanges {

    @Input() categories: CategoryWithValues[];
    @Input() viewMonth: Date;

    public dataSource;

    public hoveredTableRow = -1;
    public columns = ['categoryName', 'budgeted', 'budgetedTotal', 'offset', 'offsetTotal', 'activity', 'exists', 'actions'];

    constructor(private dialog: MatDialog) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.categories) {
            this.buildDataSource();
        }
        else if (changes.viewMonth) {
            this.buildDataSource();
        }
    }

    ngOnInit() {

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

            const budgted = (value) => {
                return value.budgeted;
            };

            const offset = (value) => {
                return value.offset;
            };

            const first = (element) => {
                return !!element;
            };

            const offsetTotal = category.values.filter(isOnOrBeforeViewMonth).map(offset).reduce(sum, 0);
            const budgetedTotal = category.values.filter(isOnOrBeforeViewMonth).map(budgted).reduce(sum, 0);
            let [desiredValue]: any = category.values.filter(isOnViewMonth);

            if (!desiredValue) {
                desiredValue = {
                    categoryId: category.categoryId,
                    budgeted: 0,
                    offset: 0,
                    budgetMonth: this.viewMonth,
                    exists: false
                };
            }
            else {
                desiredValue.exists = true;
            }

            return {
                offsetTotal,
                budgetedTotal,
                desiredValue: {
                    ...desiredValue,
                },
                ...category
            };
        });
    }
}
