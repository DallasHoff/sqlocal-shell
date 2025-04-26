import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellHeaderComponent } from './shell-header.component';

describe('ShellHeaderComponent', () => {
  let component: ShellHeaderComponent;
  let fixture: ComponentFixture<ShellHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
