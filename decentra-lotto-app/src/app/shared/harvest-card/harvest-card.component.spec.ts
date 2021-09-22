import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestCardComponent } from './harvest-card.component';

describe('HarvestCardComponent', () => {
  let component: HarvestCardComponent;
  let fixture: ComponentFixture<HarvestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
