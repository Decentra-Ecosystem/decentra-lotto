import { TestBed } from '@angular/core/testing';

import { PlatformCheckerService } from './platform.service';

describe('PlatformCheckerService', () => {
  let service: PlatformCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
