import { Injectable, signal } from '@angular/core';
import { SQLocal } from 'sqlocal';

@Injectable({
  providedIn: 'root',
})
export class ShellDatabaseService {
  private database: SQLocal;

  databaseName = signal<string>('');
  databasePath = signal<string>('');

  constructor() {
    this.database = this.setDatabase('database.sqlite3');
  }

  private connectDatabase(databasePath: string): SQLocal {
    if (databasePath === this.databasePath()) {
      return this.database;
    }

    return new SQLocal({
      databasePath,
      processor: new Worker(new URL('../sqlocal.worker', import.meta.url)),
    });
  }

  getDatabase(): SQLocal {
    return this.database;
  }

  setDatabase(databasePath: string): SQLocal {
    if (this.database) {
      this.database.destroy();
    }

    this.database = this.connectDatabase(databasePath);

    const directories = databasePath
      .split(/[\\/]/)
      .filter((part) => part !== '');
    const fileName = directories.pop();

    this.databaseName.set(fileName ?? '');
    this.databasePath.set(databasePath ?? '');

    return this.database;
  }

  async deleteDatabase(databasePath: string) {
    const isCurrent = databasePath === this.databasePath();
    const database = this.connectDatabase(databasePath);
    await database.deleteDatabaseFile();

    if (!isCurrent) {
      await database.destroy();

      const directories = databasePath
        .split(/[\\/]/)
        .filter((part) => part !== '');
      const fileName = directories.pop();
      if (!fileName) return;

      let dirHandle = await navigator.storage.getDirectory();
      for (let dirName of directories)
        dirHandle = await dirHandle.getDirectoryHandle(dirName);

      await dirHandle.removeEntry(fileName);
    }
  }

  async downloadDatabase(databasePath: string) {
    const database = this.connectDatabase(databasePath);
    const file = await database.getDatabaseFile();
    const fileName = databasePath.split(/[\\/]/).pop();
    const fileUrl = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName ?? 'database.sqlite3';
    a.click();
    a.remove();
    URL.revokeObjectURL(fileUrl);
  }

  async listDatabases(): Promise<string[]> {
    const opfs = await navigator.storage.getDirectory();
    const dbFileNames = [];

    // TODO: handle subdirectories
    for await (let [dbFileName] of opfs.entries()) {
      dbFileNames.push(dbFileName);
    }

    return dbFileNames;
  }
}
