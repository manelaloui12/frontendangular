import { TestBed } from '@angular/core/testing';

import { clientService } from './client.service';

describe('ClientService', () => {
  let service: clientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(clientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
