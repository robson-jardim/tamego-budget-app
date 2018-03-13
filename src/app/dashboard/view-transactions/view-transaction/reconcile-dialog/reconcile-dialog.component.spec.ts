import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconcileTransactionsDialogComponent } from './reconcile-dialog.component';

describe('ReconcileTransactionsDialogComponent', () => {
    let component: ReconcileTransactionsDialogComponent;
    let fixture: ComponentFixture<ReconcileTransactionsDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReconcileTransactionsDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReconcileTransactionsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
