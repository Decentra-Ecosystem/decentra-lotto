import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarsecosystemComponent } from './marsecosystem.component';

describe('MarsecosystemComponent', () => {
  let component: MarsecosystemComponent;
  let fixture: ComponentFixture<MarsecosystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarsecosystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarsecosystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
