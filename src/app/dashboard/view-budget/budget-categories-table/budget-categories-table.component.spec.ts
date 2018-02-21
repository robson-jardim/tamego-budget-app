import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategoriesTableComponent } from './budget-categories-table.component';

describe('BudgetCategoriesTableComponent', () => {
    let component: BudgetCategoriesTableComponent;
    let fixture: ComponentFixture<BudgetCategoriesTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BudgetCategoriesTableComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BudgetCategoriesTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
