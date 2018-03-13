import { inject, TestBed } from '@angular/core/testing';

import { CloseDialogService } from './close-dialog.service';

describe('CloseDialogService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CloseDialogService]
        });
    });

    it('should be created', inject([CloseDialogService], (service: CloseDialogService) => {
        expect(service).toBeTruthy();
    }));
});
