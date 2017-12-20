import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryGroupDialogComponent } from './category-group-dialog.component';

describe('CategoryGroupDialogComponent', () => {
    let component: CategoryGroupDialogComponent;
    let fixture: ComponentFixture<CategoryGroupDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CategoryGroupDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CategoryGroupDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
