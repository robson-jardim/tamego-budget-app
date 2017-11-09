import {Component, OnInit} from '@angular/core';
import {AuthService} from '../core/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

    signUpForm: FormGroup;

    public formErrors = {
        name: '',
        email: '',
        password: '',
    };

    constructor(public auth: AuthService, private formBuilder: FormBuilder) {


    }

    ngOnInit() {
        this.buildForm();
    }

    private buildForm() {
        this.signUpForm = this.formBuilder.group({
            email: ['', Validators.required, Validators.email],
            password:  ['', Validators.required],
        });
    }

    public signup() {
        if(this.signUpForm.valid) {

        }
        else {
            
        }
    }




}
