import { TestBed, inject } from '@angular/core/testing';

import { ReoccurringService } from './reoccurring.service';

describe('ReoccurringService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ReoccurringService]
        });
    });

    it('should be created', inject([ReoccurringService], (service: ReoccurringService) => {
        expect(service).toBeTruthy();
    }));
});
