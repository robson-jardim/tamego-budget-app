import { inject, TestBed } from '@angular/core/testing';

import { FirestoreService } from './firestore.service';

describe('FirebaseResultService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FirestoreService]
        });
    });

    it('should be created', inject([FirestoreService], (service: FirestoreService) => {
        expect(service).toBeTruthy();
    }));
});
