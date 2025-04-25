import type { Type } from '@angular/core';

export type Entry = InputEntry | OutputEntry;

export type InputEntry = {
  type: 'input';
  prompt: string;
  command: string;
  message?: EntryMessageComponent;
};

export type OutputEntry = {
  type: 'output';
  prompt: string;
  message: string | EntryMessageComponent;
};

type EntryMessageComponent = {
  component: Type<unknown>;
  inputs: Record<string, unknown>;
};
