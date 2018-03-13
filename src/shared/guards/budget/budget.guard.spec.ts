import { inject, TestBed } from '@angular/core/testing';

import { BudgetGuard } from './budget.guard';

describe('BudgetGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BudgetGuard]
    });
  });

  it('should ...', inject([BudgetGuard], (guard: BudgetGuard) => {
    expect(guard).toBeTruthy();
  }));
});
