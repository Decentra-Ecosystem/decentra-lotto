import { TestBed } from '@angular/core/testing';

import { LotteryService } from './lottery.service';

describe('LotteryService', () => {
  let service: LotteryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LotteryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
