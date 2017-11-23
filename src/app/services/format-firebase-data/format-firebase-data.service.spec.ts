import { TestBed, inject } from '@angular/core/testing';

import { FormatFirebaseDataService } from './format-firebase-data.service';

describe('FormatFirebaseDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatFirebaseDataService]
    });
  });

  it('should be created', inject([FormatFirebaseDataService], (service: FormatFirebaseDataService) => {
    expect(service).toBeTruthy();
  }));
});
