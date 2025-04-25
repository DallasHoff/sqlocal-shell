import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ShellCommandsService } from '../../services/shell-commands.service';
import { ShellDatabaseService } from '../../services/shell-database.service';

@Component({
  selector: 'shell',
  imports: [NgComponentOutlet],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  dbService = inject(ShellDatabaseService);
  commandService = inject(ShellCommandsService);

  entry = viewChild.required<ElementRef<HTMLElement>>('entry');
  entryText = signal<string>('');
  entryEffect = effect(() => {
    this.entryText();
    if (this.isEntryFocused()) return;
    this.syncEntry();
  });

  pressed = signal({
    Shift: false,
    Control: false,
    Alt: false,
    Meta: false,
  });
  ignoreLetter = computed(() => {
    const { Control, Alt, Meta } = this.pressed();
    return Control || Alt || Meta;
  });

  history = computed(() => {
    const history = this.commandService.history();
    return history.filter((item) => item.type === 'input' || !!item.message);
  });

  @HostListener('document:keydown', ['$event'])
  async onKeydown(event: KeyboardEvent) {
    const key = event.key;

    if (this.isModifierKey(key)) {
      this.pressed.update((pressed) => {
        return { ...pressed, [key]: true };
      });
    }

    if (!this.isEntryFocused()) {
      if (key === 'Backspace') {
        this.entryText.update((entryText) => entryText.slice(0, -1));
      } else if (
        key.length === 1 &&
        !this.isModifierKey(key) &&
        !this.ignoreLetter()
      ) {
        this.entryText.update((entryText) => entryText + key);
      }
    }

    if (this.isActionKey(key)) {
      event.preventDefault();

      const history = this.commandService.history();
      const historyPosition = this.commandService.historyPosition();

      if (key === 'Enter') {
        const input = this.entryText();
        this.entryText.set('');
        await this.commandService.exec(input);
      } else if (key === 'Escape') {
        this.entryText.set('');
      } else if (key === 'ArrowUp' || key === 'ArrowDown') {
        const historyInputs = history.filter((item) => item.type === 'input');
        const positionChange = key === 'ArrowUp' ? -1 : 1;
        let position =
          historyPosition === null ? historyInputs.length : historyPosition;
        position += positionChange;
        position = Math.max(0, Math.min(position, historyInputs.length - 1));
        this.commandService.historyPosition.set(position);
        this.entryText.set(historyInputs[position]?.command ?? '');
      }

      this.syncEntry();
      const entryText = this.entryText();
      const entryElement = this.entry().nativeElement;
      const selectionRange = document.getSelection()?.getRangeAt(0);
      entryElement.focus();

      if (selectionRange && entryText) {
        selectionRange.setStart(entryElement, 1);
        selectionRange.setEnd(entryElement, 1);
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    const key = event.key;

    if (this.isModifierKey(key)) {
      this.pressed.update((pressed) => {
        return { ...pressed, [key]: false };
      });
    }
  }

  @HostListener('document:paste', ['$event'])
  async onPaste() {
    if (this.isEntryFocused()) return;
    const pastedText = await navigator.clipboard.readText();
    this.entryText.update((entryText) => entryText + pastedText);
  }

  onInput(event: Event) {
    const newEntryText =
      event.target instanceof HTMLElement ? event.target.innerText : null;
    if (newEntryText === null) return;
    this.entryText.set(newEntryText);
  }

  isEntryFocused(): boolean {
    return document.activeElement === this.entry().nativeElement;
  }

  isModifierKey(key: string): boolean {
    return (
      key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta'
    );
  }

  isActionKey(key: string): boolean {
    return (
      key === 'Enter' ||
      key === 'Escape' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown'
    );
  }

  syncEntry() {
    this.entry().nativeElement.innerText = this.entryText();
  }
}
