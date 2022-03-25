import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EthlotteryComponent } from './ethlottery.component';

describe('EthlotteryComponent', () => {
  let component: EthlotteryComponent;
  let fixture: ComponentFixture<EthlotteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EthlotteryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EthlotteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
