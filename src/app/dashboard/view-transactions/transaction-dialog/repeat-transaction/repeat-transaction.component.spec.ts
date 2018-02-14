import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatTransactionComponent } from './repeat-transaction.component';

describe('RepeatTransactionComponent', () => {
    let component: RepeatTransactionComponent;
    let fixture: ComponentFixture<RepeatTransactionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RepeatTransactionComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RepeatTransactionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
