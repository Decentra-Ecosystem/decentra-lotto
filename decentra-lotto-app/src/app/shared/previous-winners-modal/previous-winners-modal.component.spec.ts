import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousWinnersModalComponent } from './previous-winners-modal.component';

describe('PreviousWinnersModalComponent', () => {
  let component: PreviousWinnersModalComponent;
  let fixture: ComponentFixture<PreviousWinnersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousWinnersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousWinnersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
