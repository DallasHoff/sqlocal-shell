import { effect, Injectable, signal } from '@angular/core';
import { SQLocal } from 'sqlocal';

@Injectable({
  providedIn: 'root',
})
export class ShellDatabaseService {
  private database: SQLocal;

  databasePath = signal<string>('');

  constructor() {
    const storageKey = 'last-database';
    const defaultDatabase = 'database.sqlite3';
    const openDatabase = localStorage.getItem(storageKey) || defaultDatabase;

    this.database = this.setDatabase(openDatabase);

    effect(() => {
      const databasePath = this.databasePath();
      if (!databasePath) return;
      localStorage.setItem(storageKey, databasePath);
    });
  }

  private connectDatabase(databasePath: string): SQLocal {
    if (databasePath === this.databasePath()) {
      return this.database;
    }

    return new SQLocal({
      databasePath,
      processor: new Worker(new URL('../../sqlocal.worker', import.meta.url)),
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

  async uploadDatabase(databasePath: string) {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();

    await new Promise((resolve) => {
      input.addEventListener('change', resolve, { once: true });
    });

    const file = input.files?.item(0);
    if (!file) return false;

    const database = this.connectDatabase(databasePath);
    await database.overwriteDatabaseFile(file);
    input.remove();

    return true;
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
    const dbFileNames: string[] = [];
    const opfs = await navigator.storage.getDirectory();

    const scanDir = async (
      dirHandle: FileSystemDirectoryHandle,
      path: string,
    ) => {
      for await (let [fileName, handle] of dirHandle.entries()) {
        if (handle instanceof FileSystemDirectoryHandle) {
          await scanDir(handle, `${path}${handle.name}/`);
        } else {
          dbFileNames.push(`${path}${fileName}`);
        }
      }
    };

    await scanDir(opfs, '');

    return dbFileNames;
  }
}
