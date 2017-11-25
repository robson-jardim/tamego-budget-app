import { TestBed, inject } from '@angular/core/testing';

import { FormatFirestoreDataService } from './format-firebase-data.service';

describe('FormatFirebaseDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatFirestoreDataService]
    });
  });

  it('should be created', inject([FormatFirestoreDataService], (service: FormatFirestoreDataService) => {
    expect(service).toBeTruthy();
  }));
});
