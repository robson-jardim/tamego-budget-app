import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

    constructor (public auth: AuthService) {
    }

    ngOnInit () {
    }

    test () {
        this.auth.createUserWithEmailAndPassword("ecl150030", "asdfasdfasd");
    }

}
