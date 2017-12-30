import { TestBed, inject } from '@angular/core/testing';
import { FirebaseReferenceService } from './firestore-reference.service';

describe('DatabaseService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FirebaseReferenceService]
        });
    });

    it('should be created', inject([FirebaseReferenceService], (service: FirebaseReferenceService) => {
        expect(service).toBeTruthy();
    }));
});
