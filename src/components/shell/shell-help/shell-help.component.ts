import { Component, computed, inject } from '@angular/core';
import { ShellCommandsService } from '../../../services/shell-commands/shell-commands.service';

@Component({
  selector: 'shell-help',
  imports: [],
  templateUrl: './shell-help.component.html',
  styleUrl: './shell-help.component.scss',
})
export class ShellHelpComponent {
  commandService = inject(ShellCommandsService);

  commands = computed(() => {
    return Object.entries(this.commandService.commands).map(
      ([name, { description }]) => ({ name, description }),
    );
  });
}
