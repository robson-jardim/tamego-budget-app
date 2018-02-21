import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CloseDialogService } from '@shared/services/close-dialog/close-dialog.service';
import { LinkAnonymousAccountDialogComponent } from '@shared/components/link-anonymous-account-dialog/link-anonymous-account-dialog.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    @Input() hideOptions: boolean;
    @Input() showDemo: boolean;
    @Output() onSidenavToggle: EventEmitter<any> = new EventEmitter();
    @Input() showSidenavToggle;

    constructor(public auth: AuthService, private route: Router, private dialogService: CloseDialogService) {
    }

    ngOnInit() {
    }

    public openLinkAnonymousAccountDialog() {
        this.dialogService.open(LinkAnonymousAccountDialogComponent, {
            width: '400px',
            maxWidth: '400px'
        });
    }

    public toggleSidenav() {
        this.onSidenavToggle.emit();
    }
}
