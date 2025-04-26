import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'sql-result',
  imports: [],
  templateUrl: './sql-result.component.html',
  styleUrl: './sql-result.component.scss',
})
export class SqlResultComponent implements AfterViewInit {
  data = input.required<Record<string, unknown>[]>();
  scrollTo = input<boolean>(true);
  result = viewChild<ElementRef<HTMLElement>>('result');

  ngAfterViewInit() {
    if (this.scrollTo()) {
      this.result()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  headings = computed(() => {
    return Object.keys(this.data()[0] ?? {});
  });

  rows = computed(() => {
    return this.data().map((row) => {
      const values = Object.values(row);
      return values.map((value) => {
        const type = value === null ? 'null' : typeof value;
        return { type, value };
      });
    });
  });
}
