import { TestBed } from '@angular/core/testing';
import { ShellDatabaseService } from '../shell-database/shell-database.service';

import { ShellSuggestionsService } from './shell-suggestions.service';

describe('ShellSuggestionsService', () => {
  let service: ShellSuggestionsService;
  let dbService: ShellDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShellDatabaseService],
    });
    service = TestBed.inject(ShellSuggestionsService);
    dbService = TestBed.inject(ShellDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should suggest commands', () => {
    expect(service.getSuggestion('.')).toBe('');
    expect(service.getSuggestion('.help')).toBe('');
    expect(service.getSuggestion('.he')).toBe('lp');
    expect(service.getSuggestion('.d')).toBe('atabases');
    expect(service.getSuggestion('.de')).toBe('lete');
  });

  it('should suggest databases', () => {
    spyOn(dbService, 'databaseListCache').and.returnValue([
      'database.sqlite3',
      'demo/db.sqlite3',
      'foo.db',
      'bar.db',
    ]);

    expect(service.getSuggestion('.open d')).toBe('atabase.sqlite3');
    expect(service.getSuggestion('.import de')).toBe('mo/db.sqlite3');
    expect(service.getSuggestion('.export foo')).toBe('.db');
    expect(service.getSuggestion('.delete bar.')).toBe('db');
    expect(service.getSuggestion('.help d')).toBe('');
  });
});
