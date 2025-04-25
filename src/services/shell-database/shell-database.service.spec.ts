import { TestBed } from '@angular/core/testing';

import { ShellDatabaseService } from './shell-database.service';

describe('ShellDatabaseService', () => {
  let service: ShellDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShellDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
