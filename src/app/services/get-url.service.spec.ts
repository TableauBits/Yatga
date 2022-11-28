import { TestBed } from '@angular/core/testing';

import { GetUrlService } from './get-url.service';

describe('GetUrlService', () => {
  let service: GetUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
