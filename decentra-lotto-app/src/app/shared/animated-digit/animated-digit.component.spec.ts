import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedDigitComponent } from './animated-digit.component';

describe('AnimatedDigitComponent', () => {
  let component: AnimatedDigitComponent;
  let fixture: ComponentFixture<AnimatedDigitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatedDigitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedDigitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
