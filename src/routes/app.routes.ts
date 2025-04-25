import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => {
      return import('../components/shell/shell.component').then(
        (m) => m.ShellComponent,
      );
    },
  },
];
