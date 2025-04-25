import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellErrorComponent } from './shell-error.component';

describe('ShellErrorComponent', () => {
  let component: ShellErrorComponent;
  let fixture: ComponentFixture<ShellErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
