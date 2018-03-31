import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancellationDialogComponent } from './confirm-cancellation-dialog.component';

describe('ConfirmCancellationDialogComponent', () => {
    let component: ConfirmCancellationDialogComponent;
    let fixture: ComponentFixture<ConfirmCancellationDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmCancellationDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmCancellationDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
