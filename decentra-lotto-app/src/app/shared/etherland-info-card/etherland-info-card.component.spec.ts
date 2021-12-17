import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtherlandInfoCardComponent } from './etherland-info-card.component';

describe('EtherlandInfoCardComponent', () => {
  let component: EtherlandInfoCardComponent;
  let fixture: ComponentFixture<EtherlandInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtherlandInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtherlandInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
