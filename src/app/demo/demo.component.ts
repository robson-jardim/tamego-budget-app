import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { HttpRequestService } from 'shared/services/http-request/http-request.service';
import { AuthService } from 'shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

    constructor(private afAuth: AngularFireAuth,
                private auth: AuthService,
                private router: Router) {
    }

    ngOnInit() {
        this.auth.user.flatMap(user => {
            if (!user) {
                return this.createAnonymousAccount();
            }
            else {
                return Observable.of(null);
            }
        }).flatMap(() => {
            return this.auth.user.first(x => x != null);
        }).do(() => {
            this.router.navigate(['budgets'], {replaceUrl: true});
        }).first().subscribe();
    }

    public createAnonymousAccount(): Observable<any> {
        return Observable.fromPromise(this.afAuth.auth.signInAnonymously());
    }

}
