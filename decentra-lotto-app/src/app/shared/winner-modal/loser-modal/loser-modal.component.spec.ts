import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoserModalComponent } from './loser-modal.component';

describe('LoserModalComponent', () => {
  let component: LoserModalComponent;
  let fixture: ComponentFixture<LoserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
