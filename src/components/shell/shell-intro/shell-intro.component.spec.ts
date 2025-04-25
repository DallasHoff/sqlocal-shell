import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellIntroComponent } from './shell-intro.component';

describe('ShellIntroComponent', () => {
  let component: ShellIntroComponent;
  let fixture: ComponentFixture<ShellIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellIntroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show package versions', () => {
    const versionRegex = /^\d+\.\d+\.\d+$/;
    expect(component.sqlocalVersion).toMatch(versionRegex);
    expect(component.sqliteVersion).toMatch(versionRegex);
  });
});
