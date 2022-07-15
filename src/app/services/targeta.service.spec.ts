import { TestBed } from '@angular/core/testing';

import { TargetaService } from './targeta.service';

describe('TargetaService', () => {
  let service: TargetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
