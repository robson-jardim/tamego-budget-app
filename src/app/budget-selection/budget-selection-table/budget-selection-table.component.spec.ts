import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSelectionTableComponent } from './budget-selection-table.component';

describe('BudgetSelectionTableComponent', () => {
  let component: BudgetSelectionTableComponent;
  let fixture: ComponentFixture<BudgetSelectionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetSelectionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetSelectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
