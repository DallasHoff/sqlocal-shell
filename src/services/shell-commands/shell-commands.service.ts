import { computed, inject, Injectable, signal } from '@angular/core';
import { ShellDatabaseService } from '../shell-database/shell-database.service';
import type { SQLocal } from 'sqlocal';
import { ShellErrorComponent } from '../../components/shell/shell-error/shell-error.component';
import { SqlQueryComponent } from '../../components/sql/sql-query/sql-query.component';
import { ShellListComponent } from '../../components/shell/shell-list/shell-list.component';
import { ShellDatabaseInfoComponent } from '../../components/shell/shell-database-info/shell-database-info.component';
import { SqlResultComponent } from '../../components/sql/sql-result/sql-result.component';
import { ShellIntroComponent } from '../../components/shell/shell-intro/shell-intro.component';
import { Entry, InputEntry, OutputEntry } from './shell-commands.type';

@Injectable({
  providedIn: 'root',
})
export class ShellCommandsService {
  private dbService = inject(ShellDatabaseService);

  readonly commands: Record<
    string,
    {
      description: string;
      fn: (db: SQLocal, arg: string) => Promise<OutputEntry['message']>;
    }
  > = {
    clear: {
      description: '',
      fn: async () => {
        this.history.set([]);
        this.historyPosition.set(null);
        return '';
      },
    },
    databases: {
      description: '',
      fn: async () => {
        const dbFileNames = await this.dbService.listDatabases();
        return {
          component: ShellListComponent,
          inputs: { heading: 'All Database Files', items: dbFileNames },
        };
      },
    },
    tables: {
      description: '',
      fn: async (db) => {
        const result = await db.sql('SELECT name FROM sqlite_master');
        let tableNames = result.map((table) => table['name']);
        return {
          component: ShellListComponent,
          inputs: { heading: 'All Tables', items: tableNames },
        };
      },
    },
    open: {
      description: '',
      fn: async (_, arg) => {
        this.dbService.setDatabase(arg);
        await navigator.storage.persist();
        return `Connected to "${arg}"`;
      },
    },
    info: {
      description: '',
      fn: async (db) => {
        const info = await db.getDatabaseInfo();
        return {
          component: ShellDatabaseInfoComponent,
          inputs: { info },
        };
      },
    },
    import: {
      description: '',
      fn: async (_, arg) => {
        const databasePath = arg || this.dbService.databasePath();
        const uploaded = await this.dbService.uploadDatabase(databasePath);
        if (!uploaded) return '';
        return `Imported "${databasePath}"`;
      },
    },
    export: {
      description: '',
      fn: async (_, arg) => {
        const databasePath = arg || this.dbService.databasePath();
        await this.dbService.downloadDatabase(databasePath);
        return `Exported "${databasePath}"`;
      },
    },
    delete: {
      description: '',
      fn: async (_, arg) => {
        const databasePath = arg || this.dbService.databasePath();
        await this.dbService.deleteDatabase(databasePath);
        return `Deleted "${databasePath}"`;
      },
    },
  };

  running = signal<boolean>(false);
  history = signal<Entry[]>([]);
  historyPosition = signal<number | null>(null);

  prompt = computed(() => {
    return this.dbService.databaseName();
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
    const command = commandText.trim();
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
        const [_, action, arg] = Array.from(
          command.match(/^\.(\w+)\s*(.*)$/) ?? [],
        );
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
}
