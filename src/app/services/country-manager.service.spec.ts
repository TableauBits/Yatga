import { TestBed } from '@angular/core/testing';

import { CountryManagerService } from './country-manager.service';

describe('CountryManagerService', () => {
  let service: CountryManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
