import { TestBed } from '@angular/core/testing';
import { NichosService } from './nicho.service';

describe('NichosService', () => {
  let service: NichosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NichosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
