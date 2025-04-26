import { Component, inject } from '@angular/core';
import { ShellCommandsService } from '../../../services/shell-commands/shell-commands.service';
import packageLockJson from '../../../../package-lock.json';

@Component({
  selector: 'shell-intro',
  imports: [],
  templateUrl: './shell-intro.component.html',
  styleUrl: './shell-intro.component.scss',
})
export class ShellIntroComponent {
  commandService = inject(ShellCommandsService);

  databaseName = this.commandService.prompt();
  packages = packageLockJson.packages;
  sqlocalVersion = this.packages['node_modules/sqlocal'].version;
  sqliteVersion =
    this.packages['node_modules/@sqlite.org/sqlite-wasm'].version.split('-')[0];
}
