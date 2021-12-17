import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtherlandVideoComponent } from './etherland-video.component';

describe('EtherlandVideoComponent', () => {
  let component: EtherlandVideoComponent;
  let fixture: ComponentFixture<EtherlandVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtherlandVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtherlandVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
