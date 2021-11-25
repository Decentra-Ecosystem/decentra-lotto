import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldofwavesVideoComponent } from './worldofwaves-video.component';

describe('WorldofwavesVideoComponent', () => {
  let component: WorldofwavesVideoComponent;
  let fixture: ComponentFixture<WorldofwavesVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldofwavesVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldofwavesVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
