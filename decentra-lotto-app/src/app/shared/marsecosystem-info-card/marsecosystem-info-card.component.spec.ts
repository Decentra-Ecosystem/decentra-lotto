import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarsecosystemInfoCardComponent } from './marsecosystem-info-card.component';

describe('MarsecosystemInfoCardComponent', () => {
  let component: MarsecosystemInfoCardComponent;
  let fixture: ComponentFixture<MarsecosystemInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarsecosystemInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarsecosystemInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
