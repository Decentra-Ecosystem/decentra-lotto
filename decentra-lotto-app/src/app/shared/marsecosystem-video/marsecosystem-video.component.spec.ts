import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarsecosystemVideoComponent } from './marsecosystem-video.component';

describe('MarsecosystemVideoComponent', () => {
  let component: MarsecosystemVideoComponent;
  let fixture: ComponentFixture<MarsecosystemVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarsecosystemVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarsecosystemVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
