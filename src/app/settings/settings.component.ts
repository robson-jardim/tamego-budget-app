import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    public forceRefreshToken = true;
    public showOfflinePopups = true;

    public data;

    constructor(public auth: AuthService,
                private afs: AngularFirestore) {
    }

    ngOnInit() {
        this.auth.verifyUser(this.forceRefreshToken);

        this.data = this.afs.collection('dates').valueChanges();

        this.data.subscribe(console.log);
    }

}
