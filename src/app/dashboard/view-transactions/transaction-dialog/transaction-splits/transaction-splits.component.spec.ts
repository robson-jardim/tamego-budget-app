import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSplitsComponent } from './transaction-splits.component';

describe('TransactionSplitsComponent', () => {
  let component: TransactionSplitsComponent;
  let fixture: ComponentFixture<TransactionSplitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionSplitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionSplitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
