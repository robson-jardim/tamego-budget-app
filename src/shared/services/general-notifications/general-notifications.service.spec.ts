import { inject, TestBed } from '@angular/core/testing';

import { GeneralNotificationsService } from './general-notifications.service';

describe('GeneralNotificationsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GeneralNotificationsService]
        });
    });

    it('should be created', inject([GeneralNotificationsService], (service: GeneralNotificationsService) => {
        expect(service).toBeTruthy();
    }));
});
