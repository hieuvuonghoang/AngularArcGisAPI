import { TestBed } from '@angular/core/testing';

import { PhimAnhService } from './phim-anh.service';

describe('PhimAnhService', () => {
  let service: PhimAnhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhimAnhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
