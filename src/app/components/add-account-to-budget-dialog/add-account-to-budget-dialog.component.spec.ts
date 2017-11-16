import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountToBudgetDialogComponent } from './add-account-to-budget-dialog.component';

describe('AddAccountToBudgetDialogComponent', () => {
  let component: AddAccountToBudgetDialogComponent;
  let fixture: ComponentFixture<AddAccountToBudgetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccountToBudgetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccountToBudgetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
