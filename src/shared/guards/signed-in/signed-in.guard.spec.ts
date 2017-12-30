import { TestBed, async, inject } from '@angular/core/testing';

import { SignedOutGuard } from './signed-in.guard';

describe('SignedOutGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SignedOutGuard]
        });
    });

    it('should ...', inject([SignedOutGuard], (guard: SignedOutGuard) => {
        expect(guard).toBeTruthy();
    }));
});
