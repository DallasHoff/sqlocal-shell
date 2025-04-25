import { Component, input } from '@angular/core';

@Component({
  selector: 'shell-error',
  imports: [],
  templateUrl: './shell-error.component.html',
  styleUrl: './shell-error.component.scss',
})
export class ShellErrorComponent {
  message = input<string>('Unexpected error');
}
