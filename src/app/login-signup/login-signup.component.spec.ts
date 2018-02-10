import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninCreateAccountComponent } from './login-signup.component';

describe('SigninCreateAccountComponent', () => {
    let component: SigninCreateAccountComponent;
    let fixture: ComponentFixture<SigninCreateAccountComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SigninCreateAccountComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SigninCreateAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
