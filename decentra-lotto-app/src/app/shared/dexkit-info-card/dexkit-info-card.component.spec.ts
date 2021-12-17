import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DexkitInfoCardComponent } from './dexkit-info-card.component';

describe('DexkitInfoCardComponent', () => {
  let component: DexkitInfoCardComponent;
  let fixture: ComponentFixture<DexkitInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DexkitInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DexkitInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
