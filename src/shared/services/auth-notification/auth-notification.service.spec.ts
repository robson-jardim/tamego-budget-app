import { inject, TestBed } from '@angular/core/testing';

import { AuthNotificationService } from './auth-notification.service';

describe('AuthNotificationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthNotificationService]
        });
    });

    it('should be created', inject([AuthNotificationService], (service: AuthNotificationService) => {
        expect(service).toBeTruthy();
    }));
});
