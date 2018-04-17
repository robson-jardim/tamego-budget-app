import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartDemoComponent } from './start-demo.component';

describe('StartDemoComponent', () => {
  let component: StartDemoComponent;
  let fixture: ComponentFixture<StartDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
