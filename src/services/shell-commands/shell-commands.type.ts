import type { Type } from '@angular/core';
import type { SQLocal } from 'sqlocal';

export type Entry = InputEntry | OutputEntry;

export type InputEntry = {
  type: 'input';
  prompt: string;
  command: string;
  message?: EntryMessageComponent;
  hidden?: boolean;
};

export type OutputEntry = {
  type: 'output';
  prompt: string;
  message: string | EntryMessageComponent;
  hidden?: boolean;
};

type EntryMessageComponent = {
  component: Type<unknown>;
  inputs: Record<string, unknown>;
};

export type CommandConfig = {
  description: string;
  argType?: 'database';
  fn: (db: SQLocal, arg: string) => Promise<OutputEntry['message']>;
};
