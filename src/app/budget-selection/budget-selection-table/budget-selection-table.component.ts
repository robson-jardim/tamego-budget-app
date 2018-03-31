import { Component, Input, OnInit } from '@angular/core';
import { BudgetId } from '@models/budget.model';
import { CategoryId } from '@models/category.model';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { BudgetDialogComponent } from '../budget-dialog/budget-dialog.component';

@Component({
    selector: 'app-budget-selection-table',
    templateUrl: './budget-selection-table.component.html',
    styleUrls: ['./budget-selection-table.component.scss']
})
export class BudgetSelectionTableComponent implements OnInit {

    @Input() budgets: BudgetId[];
    displayedColumns = ['name', 'lastModified', 'actions'];

    constructor(private diaglogService: CloseDialogService) {
    }

    ngOnInit() {
    }

    public trackBudget(index, budget: BudgetId) {
        return budget ? budget.budgetId : undefined;
    }

    public updateBudget(budget: BudgetId) {
        this.diaglogService.openUpdate(BudgetDialogComponent, {
            data: {
                ...budget
            }
        });
    }
}
