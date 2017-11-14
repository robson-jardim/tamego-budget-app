import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBudgetDialogComponent } from './add-budget-dialog.component';

describe('AddBudgetDialogComponent', () => {
  let component: AddBudgetDialogComponent;
  let fixture: ComponentFixture<AddBudgetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBudgetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBudgetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
