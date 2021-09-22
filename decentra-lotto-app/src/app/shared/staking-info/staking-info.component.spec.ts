import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakingInfoComponent } from './staking-info.component';

describe('StakingInfoComponent', () => {
  let component: StakingInfoComponent;
  let fixture: ComponentFixture<StakingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
