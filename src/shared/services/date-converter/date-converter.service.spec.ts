import { TestBed, inject } from '@angular/core/testing';
import { UtilityService } from './date-converter.service';


describe('UtilityService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UtilityService]
        });
    });

    it('should be created', inject([UtilityService], (service: UtilityService) => {
        expect(service).toBeTruthy();
    }));
});
