import { Component, computed, input } from '@angular/core';
import { highlight } from 'sql-highlight';

@Component({
  selector: 'sql-query',
  imports: [],
  templateUrl: './sql-query.component.html',
})
export class SqlQueryComponent {
  sql = input<string>('');

  highlightedSql = computed<string>(() => {
    return highlight(this.sql(), { html: true });
  });
}
