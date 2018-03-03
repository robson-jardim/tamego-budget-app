import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyValueChipComponent } from './money-value-chip.component';

describe('MoneyValueChipComponent', () => {
    let component: MoneyValueChipComponent;
    let fixture: ComponentFixture<MoneyValueChipComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MoneyValueChipComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MoneyValueChipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
