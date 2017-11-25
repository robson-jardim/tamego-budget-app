import { TestBed, inject } from '@angular/core/testing';

import { FirebaseResultService } from './firebase-result.service';

describe('FirebaseResultService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseResultService]
    });
  });

  it('should be created', inject([FirebaseResultService], (service: FirebaseResultService) => {
    expect(service).toBeTruthy();
  }));
});
