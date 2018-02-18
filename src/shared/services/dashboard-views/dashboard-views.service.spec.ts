import { TestBed, inject } from '@angular/core/testing';

import { DashboardViewService } from './dashboard-views.service';

describe('DashboardViewService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DashboardViewService]
        });
    });

    it('should be created', inject([DashboardViewService], (service: DashboardViewService) => {
        expect(service).toBeTruthy();
    }));
});
