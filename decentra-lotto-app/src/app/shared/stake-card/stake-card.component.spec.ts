import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeCardComponent } from './stake-card.component';

describe('StakeCardComponent', () => {
  let component: StakeCardComponent;
  let fixture: ComponentFixture<StakeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
