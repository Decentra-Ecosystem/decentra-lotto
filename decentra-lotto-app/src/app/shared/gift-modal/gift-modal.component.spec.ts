import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftModalComponent } from './gift-modal.component';

describe('GiftModalComponent', () => {
  let component: GiftModalComponent;
  let fixture: ComponentFixture<GiftModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
