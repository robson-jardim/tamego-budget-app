import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { LinkAnonymousAccountDialogComponent } from '@shared/components/header/link-anonymous-account-dialog/link-anonymous-account-dialog.component';
import { Observable } from 'rxjs/Observable';
import { User } from '@models/user.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    @Input() title: string;
    @Input() hideOptions: boolean;

    user$: Observable<User>;

    constructor(public auth: AuthService, private route: Router, private dialogService: CloseDialogService) {
    }

    ngOnInit() {
        console.log('here');
    }

    public routeToHome() {
        this.route.navigate(['budgets']);
    }

    public routeToSettings() {
        this.route.navigate(['settings']);
    }

    public openLinkAnonymousAccountDialog() {
        this.dialogService.open(LinkAnonymousAccountDialogComponent);
    }
}
