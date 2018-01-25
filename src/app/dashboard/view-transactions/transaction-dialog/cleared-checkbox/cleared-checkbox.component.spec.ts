import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearedCheckboxComponent } from './cleared-checkbox.component';

describe('ClearedCheckboxComponent', () => {
    let component: ClearedCheckboxComponent;
    let fixture: ComponentFixture<ClearedCheckboxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClearedCheckboxComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClearedCheckboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
