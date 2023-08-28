import { TestBed } from '@angular/core/testing';

import { SongPropertyManagerService } from './song-property-manager.service';

describe('SongPropertyManagerService', () => {
  let service: SongPropertyManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongPropertyManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
