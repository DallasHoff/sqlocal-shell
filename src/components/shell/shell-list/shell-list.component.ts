import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'shell-list',
  imports: [],
  templateUrl: './shell-list.component.html',
  styleUrl: './shell-list.component.scss',
})
export class ShellListComponent {
  heading = input<string>('');
  items = input<string[]>([]);

  list = computed(() => {
    const items = this.items();
    return items.sort((a, b) => a.localeCompare(b));
  });
}
