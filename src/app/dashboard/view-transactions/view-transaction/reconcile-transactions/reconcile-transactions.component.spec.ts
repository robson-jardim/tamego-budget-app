import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconcileTransactionsComponent } from './reconcile-transactions.component';

describe('ReconcileTransactionsComponent', () => {
    let component: ReconcileTransactionsComponent;
    let fixture: ComponentFixture<ReconcileTransactionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReconcileTransactionsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReconcileTransactionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
