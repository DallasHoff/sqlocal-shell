import { Injectable, signal } from '@angular/core';
import { SQLocal } from 'sqlocal';

@Injectable({
  providedIn: 'root',
})
export class ShellDatabaseService {
  private database: SQLocal;

  databaseName = signal<string>('');

  constructor() {
    this.database = this.setDatabase('database.sqlite3');
  }

  getDatabase(): SQLocal {
    return this.database;
  }

  setDatabase(databasePath: string): SQLocal {
    this.database = new SQLocal({
      databasePath,
      processor: new Worker(new URL('../sqlocal.worker', import.meta.url)),
    });

    const directories = databasePath
      .split(/[\\/]/)
      .filter((part) => part !== '');
    const fileName = directories.pop();
    this.databaseName.set(fileName ?? '');

    return this.database;
  }

  async listDatabases(): Promise<string[]> {
    const opfs = await navigator.storage.getDirectory();
    const dbFileNames = [];

    for await (let [dbFileName] of opfs.entries()) {
      dbFileNames.push(dbFileName);
    }

    return dbFileNames;
  }
}
