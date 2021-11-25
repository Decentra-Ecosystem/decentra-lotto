import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldofwavesInfoCardComponent } from './worldofwaves-info-card.component';

describe('WorldofwavesInfoCardComponent', () => {
  let component: WorldofwavesInfoCardComponent;
  let fixture: ComponentFixture<WorldofwavesInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldofwavesInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldofwavesInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
