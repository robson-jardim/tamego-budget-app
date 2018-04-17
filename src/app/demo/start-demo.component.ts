import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from 'shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { TemporaryStartupUser } from '@models/user.model';
import { DemoService } from './demo/demo.service';

@Component({
    selector: 'app-demo',
    templateUrl: './start-demo.component.html',
    styleUrls: ['./start-demo.component.scss']
})
export class StartDemoComponent implements OnInit {

    constructor(private afAuth: AngularFireAuth,
                private auth: AuthService,
                private router: Router,
                ) {
    }

    async ngOnInit() {
        const tempUser: TemporaryStartupUser = await this.auth.createAnonymousAccount();
        this.navigateToBudgetsPage();
    }

    public navigateToBudgetsPage() {
        this.router.navigate(['budgets'], {replaceUrl: true});
    }
}
