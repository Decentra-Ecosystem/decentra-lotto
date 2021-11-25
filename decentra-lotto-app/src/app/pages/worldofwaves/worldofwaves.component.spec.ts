import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldofwavesComponent } from './worldofwaves.component';

describe('WorldofwavesComponent', () => {
  let component: WorldofwavesComponent;
  let fixture: ComponentFixture<WorldofwavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldofwavesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldofwavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
