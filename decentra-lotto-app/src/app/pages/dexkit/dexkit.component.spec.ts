import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DexkitComponent } from './dexkit.component';

describe('DexkitComponent', () => {
  let component: DexkitComponent;
  let fixture: ComponentFixture<DexkitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DexkitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DexkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
