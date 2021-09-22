import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterDrawCardComponent } from './enter-draw-card.component';

describe('EnterDrawCardComponent', () => {
  let component: EnterDrawCardComponent;
  let fixture: ComponentFixture<EnterDrawCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterDrawCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterDrawCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
