import { TestBed, inject } from '@angular/core/testing';

import { ReoccurringTransactionService } from './reoccurring-transaction.service';

describe('ReoccurringTransactionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ReoccurringTransactionService]
        });
    });

    it('should be created', inject([ReoccurringTransactionService], (service: ReoccurringTransactionService) => {
        expect(service).toBeTruthy();
    }));
});
