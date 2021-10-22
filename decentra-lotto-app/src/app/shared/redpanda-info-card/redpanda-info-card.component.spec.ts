import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedpandaInfoCardComponent } from './redpanda-info-card.component';

describe('RedpandaInfoCardComponent', () => {
  let component: RedpandaInfoCardComponent;
  let fixture: ComponentFixture<RedpandaInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedpandaInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedpandaInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
