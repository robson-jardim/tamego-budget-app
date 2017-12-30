import { TestBed, inject } from '@angular/core/testing';

import { CloseDialogService } from './dialog.service';

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
