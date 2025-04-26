import { inject, Injectable } from '@angular/core';
import { ShellCommandsService } from '../shell-commands/shell-commands.service';
import { ShellDatabaseService } from '../shell-database/shell-database.service';

@Injectable({
  providedIn: 'root',
})
export class ShellSuggestionsService {
  dbService = inject(ShellDatabaseService);
  commandService = inject(ShellCommandsService);

  getSuggestion(entryText: string) {
    if (entryText.endsWith(' ')) {
      return '';
    }

    const { action, arg } = this.commandService.parse(entryText);
    const commandNames = Object.keys(this.commandService.commands);

    const commandSuggestion =
      action && !arg
        ? commandNames.find((name) => name.startsWith(action))
        : null;

    if (commandSuggestion) {
      return this.removeSharedPrefix(commandSuggestion, action);
    }

    if (!commandNames.includes(action) || !arg) {
      return '';
    }

    const { argType } = this.commandService.commands[action] ?? {};

    if (argType === 'database') {
      const databases = this.dbService.databaseListCache();
      const databaseSuggestion = databases.find((db) => db.startsWith(arg));

      if (databaseSuggestion) {
        return this.removeSharedPrefix(databaseSuggestion, arg);
      }
    }

    return '';
  }

  private removeSharedPrefix(a: string, b: string) {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    return a.slice(i);
  }
}
