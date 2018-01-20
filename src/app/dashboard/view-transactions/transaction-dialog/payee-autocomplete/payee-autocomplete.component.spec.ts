import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeAutocompleteComponent } from './payee-autocomplete.component';

describe('PayeeAutocompleteComponent', () => {
  let component: PayeeAutocompleteComponent;
  let fixture: ComponentFixture<PayeeAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayeeAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
