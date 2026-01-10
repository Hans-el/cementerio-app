import { TestBed } from '@angular/core/testing';

import { EspaciosclsService } from './espacioscls.service';

describe('EspaciosclsService', () => {
  let service: EspaciosclsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspaciosclsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
