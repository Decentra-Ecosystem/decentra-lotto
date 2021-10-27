import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedPandaVideoComponent } from './redpanda-video.component';

describe('RedPandaVideoComponent', () => {
  let component: RedPandaVideoComponent;
  let fixture: ComponentFixture<RedPandaVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedPandaVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedPandaVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
