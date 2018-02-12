import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninSignUpComponent } from './signin-signup.component';

describe('SigninSignUpComponent', () => {
    let component: SigninSignUpComponent;
    let fixture: ComponentFixture<SigninSignUpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SigninSignUpComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SigninSignUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
