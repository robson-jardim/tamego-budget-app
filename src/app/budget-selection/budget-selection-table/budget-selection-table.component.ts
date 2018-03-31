import { Component, Input, OnInit } from '@angular/core';
import { BudgetId } from '@models/budget.model';
import { CategoryId } from '@models/category.model';

@Component({
    selector: 'app-budget-selection-table',
    templateUrl: './budget-selection-table.component.html',
    styleUrls: ['./budget-selection-table.component.scss']
})
export class BudgetSelectionTableComponent implements OnInit {

    @Input() budgets: BudgetId[];
    displayedColumns = ['name', 'lastModified', 'actions'];

    constructor() {
    }

    ngOnInit() {
    }

    public trackBudget(index, budget: BudgetId) {
        return budget ? budget.budgetId : undefined;
    }
}
