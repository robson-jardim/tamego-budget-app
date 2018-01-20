import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAutocompleteComponent } from './category-autocomplete.component';

describe('CategoryAutocompleteComponent', () => {
  let component: CategoryAutocompleteComponent;
  let fixture: ComponentFixture<CategoryAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
