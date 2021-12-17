import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DexkitVideoComponent } from './dexkit-video.component';

describe('DexkitVideoComponent', () => {
  let component: DexkitVideoComponent;
  let fixture: ComponentFixture<DexkitVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DexkitVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DexkitVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
