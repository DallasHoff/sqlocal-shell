import { TestBed } from '@angular/core/testing';

import { ShellCommandsService } from './shell-commands.service';

describe('ShellCommandsService', () => {
  let service: ShellCommandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShellCommandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
