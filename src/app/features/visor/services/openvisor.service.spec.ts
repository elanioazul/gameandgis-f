import { TestBed } from '@angular/core/testing';

import { OpenvisorService } from './openvisor.service';

describe('OpenvisorService', () => {
  let service: OpenvisorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenvisorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
