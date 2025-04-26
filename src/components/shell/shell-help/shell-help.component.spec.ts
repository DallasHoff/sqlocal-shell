import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellHelpComponent } from './shell-help.component';

describe('ShellHelpComponent', () => {
  let component: ShellHelpComponent;
  let fixture: ComponentFixture<ShellHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellHelpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
