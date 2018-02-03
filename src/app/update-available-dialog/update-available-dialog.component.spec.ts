import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAvailableDialogComponent } from './update-available-dialog.component';

describe('UpdateAvailableDialogComponent', () => {
  let component: UpdateAvailableDialogComponent;
  let fixture: ComponentFixture<UpdateAvailableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAvailableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAvailableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
