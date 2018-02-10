import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkAnonymousAccountDialogComponent } from './link-anonymous-account-dialog.component';

describe('LinkAnonymousAccountDialogComponent', () => {
  let component: LinkAnonymousAccountDialogComponent;
  let fixture: ComponentFixture<LinkAnonymousAccountDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkAnonymousAccountDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkAnonymousAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
