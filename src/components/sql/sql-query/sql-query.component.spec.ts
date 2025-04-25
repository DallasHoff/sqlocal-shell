import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlQueryComponent } from './sql-query.component';

describe('SqlQueryComponent', () => {
  let component: SqlQueryComponent;
  let fixture: ComponentFixture<SqlQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlQueryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SqlQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
