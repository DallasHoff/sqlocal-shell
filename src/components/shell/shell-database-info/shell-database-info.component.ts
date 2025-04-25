import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import type { DatabaseInfo } from 'sqlocal';

@Component({
  selector: 'shell-database-info',
  imports: [CommonModule],
  templateUrl: './shell-database-info.component.html',
  styleUrl: './shell-database-info.component.scss',
})
export class ShellDatabaseInfoComponent {
  info = input<DatabaseInfo>({});
}
