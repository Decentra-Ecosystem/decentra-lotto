import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawStatsCardComponent } from './draw-stats-card.component';

describe('DrawStatsCardComponent', () => {
  let component: DrawStatsCardComponent;
  let fixture: ComponentFixture<DrawStatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawStatsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawStatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
