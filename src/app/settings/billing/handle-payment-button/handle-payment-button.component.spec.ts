import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandlePaymentButtonComponent } from './handle-payment-button.component';

describe('HandlePaymentButtonComponent', () => {
    let component: HandlePaymentButtonComponent;
    let fixture: ComponentFixture<HandlePaymentButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HandlePaymentButtonComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HandlePaymentButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
