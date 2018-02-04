import { TestBed, async, inject } from '@angular/core/testing';

import { BudgetAccountGuard } from './budget-account.guard';

describe('BudgetAccountGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BudgetAccountGuard]
    });
  });

  it('should ...', inject([BudgetAccountGuard], (guard: BudgetAccountGuard) => {
    expect(guard).toBeTruthy();
  }));
});
