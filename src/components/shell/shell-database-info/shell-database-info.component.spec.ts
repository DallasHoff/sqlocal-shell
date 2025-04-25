import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellDatabaseInfoComponent } from './shell-database-info.component';

describe('ShellDatabaseInfoComponent', () => {
  let component: ShellDatabaseInfoComponent;
  let fixture: ComponentFixture<ShellDatabaseInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellDatabaseInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellDatabaseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
