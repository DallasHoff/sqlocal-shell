import { TestBed } from '@angular/core/testing';

import { ShellSuggestionsService } from './shell-suggestions.service';

describe('ShellSuggestionsService', () => {
  let service: ShellSuggestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShellSuggestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
