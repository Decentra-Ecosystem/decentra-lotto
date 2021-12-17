import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtherlandComponent } from './etherland.component';

describe('EtherlandComponent', () => {
  let component: EtherlandComponent;
  let fixture: ComponentFixture<EtherlandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtherlandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtherlandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
