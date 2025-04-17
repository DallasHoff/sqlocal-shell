import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SQLocal } from 'sqlocal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sqlocal-shell';

  constructor() {
    const db = new SQLocal({
      databasePath: 'shell-1.db',
      processor: new Worker(new URL('../sqlocal.worker', import.meta.url)),
    });

    db.sql('SELECT name FROM sqlite_master').then((res) => {
      console.log('DB', res);
    });
  }
}
