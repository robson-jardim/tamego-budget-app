import { inject, TestBed } from '@angular/core/testing';
import { MapFirestoreDocumentIdService } from './map-firestore-docoument-id.service';

describe('FormatFirebaseDataService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MapFirestoreDocumentIdService]
        });
    });

    it('should be created', inject([MapFirestoreDocumentIdService], (service: MapFirestoreDocumentIdService) => {
        expect(service).toBeTruthy();
    }));
});
