import { computed, inject, Injectable, signal } from '@angular/core';
import { ShellDatabaseService } from '../shell-database/shell-database.service';
import { ShellErrorComponent } from '../../components/shell/shell-error/shell-error.component';
import { SqlQueryComponent } from '../../components/sql/sql-query/sql-query.component';
import { ShellListComponent } from '../../components/shell/shell-list/shell-list.component';
import { ShellDatabaseInfoComponent } from '../../components/shell/shell-database-info/shell-database-info.component';
import { SqlResultComponent } from '../../components/sql/sql-result/sql-result.component';
import { ShellIntroComponent } from '../../components/shell/shell-intro/shell-intro.component';
import {
  CommandConfig,
  Entry,
  InputEntry,
  OutputEntry,
} from './shell-commands.type';
import { ShellHelpComponent } from '../../components/shell/shell-help/shell-help.component';

@Injectable({
  providedIn: 'root',
})
export class ShellCommandsService {
  private dbService = inject(ShellDatabaseService);

  readonly commands: Record<string, CommandConfig> = {
    help: {
      description: 'Print this help.',
      fn: async () => {
        return { component: ShellHelpComponent, inputs: {} };
      },
    },
    clear: {
      description: 'Clear the shell.',
      fn: async () => {
        this.history.update((history) => {
          return history.map((entry) => ({ ...entry, hidden: true }));
        });
        this.historyPosition.set(null);
        return '';
      },
    },
    databases: {
      description: 'List all saved databases.',
      fn: async () => {
        const dbFileNames = await this.dbService.getDatabaseList();
        return {
          component: ShellListComponent,
          inputs: { heading: 'All Database Files', items: dbFileNames },
        };
      },
    },
    open: {
      description: 'Open a database.',
      argType: 'database',
      fn: async (_, arg) => {
        if (!arg) throw new Error('No database name specified.');
        this.dbService.setDatabase(arg);
        await navigator.storage.persist();
        return `Opened "${arg}"`;
      },
    },
    tables: {
      description: 'List all tables in the open database.',
      fn: async (db) => {
        const result = await db.sql(
          "SELECT name FROM sqlite_master WHERE type = 'table'",
        );
        let tableNames = result.map((table) => table['name']);
        return {
          component: ShellListComponent,
          inputs: { heading: 'All Tables', items: tableNames },
        };
      },
    },
    info: {
      description: 'Print information about the open database.',
      fn: async (db) => {
        const info = await db.getDatabaseInfo();
        return {
          component: ShellDatabaseInfoComponent,
          inputs: { info },
        };
      },
    },
    import: {
      description: 'Choose a database file to upload.',
      argType: 'database',
      fn: async (_, arg) => {
        const databasePath = arg || this.dbService.databasePath();
        const uploaded = await this.dbService.uploadDatabase(databasePath);
        if (!uploaded) return '';
        return `Imported "${databasePath}"`;
      },
    },
    export: {
      description: 'Download a copy of a database file.',
      argType: 'database',
      fn: async (_, arg) => {
        const databasePath = arg || this.dbService.databasePath();
        await this.dbService.downloadDatabase(databasePath);
        return `Exported "${databasePath}"`;
      },
    },
    delete: {
      description: 'Delete a database.',
      argType: 'database',
      fn: async (_, arg) => {
        const databasePath = arg || this.dbService.databasePath();
        await this.dbService.deleteDatabase(databasePath);
        return `Deleted "${databasePath}"`;
      },
    },
    demo: {
      description: 'Download and open a demo database.',
      fn: async () => {
        const databasePath = 'demo/chinook.sqlite3';
        const databaseRes = await fetch('/databases/chinook.sqlite3');
        const databaseFile = await databaseRes.blob();
        await this.dbService.overwriteDatabase(databasePath, databaseFile);
        this.dbService.setDatabase(databasePath);
        return `Downloaded and opened "${databasePath}"`;
      },
    },
  };

  running = signal<boolean>(false);
  history = signal<Entry[]>([]);
  historyPosition = signal<number | null>(null);

  prompt = computed(() => {
    return this.dbService.databasePath();
  });

  constructor() {
    this.history.set([
      {
        type: 'output',
        prompt: this.prompt(),
        message: { component: ShellIntroComponent, inputs: {} },
      },
    ]);
  }

  async exec(commandText: string) {
    const { command, action, arg } = this.parse(commandText);
    const isSql = !command.startsWith('.');
    const db = this.dbService.getDatabase();
    const prompt = this.prompt();

    let input: InputEntry = { type: 'input', prompt, command };
    let output: OutputEntry;

    try {
      if (isSql) {
        input.message = {
          component: SqlQueryComponent,
          inputs: { sql: command },
        };
      }
    } finally {
      this.history.update((history) => [...history, input]);
    }

    try {
      if (command === '') {
        output = { type: 'output', prompt, message: '' };
        return;
      }

      this.running.set(true);

      if (!isSql) {
        const commandConfig = this.commands[action];

        if (!commandConfig) {
          throw new Error(`Unknown command: ".${action}"`);
        } else {
          const message = await commandConfig.fn(db, arg);
          output = { type: 'output', prompt, message };
        }
      } else {
        const result = await db.sql(command);
        console.log(result);
        output = {
          type: 'output',
          prompt,
          message: {
            component: SqlResultComponent,
            inputs: { data: result },
          },
        };
      }
    } catch (err) {
      output = {
        type: 'output',
        prompt: this.prompt(),
        message: {
          component: ShellErrorComponent,
          inputs: { message: err instanceof Error ? err.message : null },
        },
      };
    } finally {
      this.history.update((history) => [...history, output]);
      this.historyPosition.set(null);
      this.running.set(false);
    }
  }

  parse(commandText: string) {
    const command = commandText.trim();
    const [_, action = '', arg = ''] = Array.from(
      command.match(/^\.(\w+)\s*(.*)$/) ?? [],
    );
    return { command, action, arg };
  }
}
