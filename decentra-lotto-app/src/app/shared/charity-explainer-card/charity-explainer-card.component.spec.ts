import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityExplainerCardComponent } from './charity-explainer-card.component';

describe('CharityExplainerCardComponent', () => {
  let component: CharityExplainerCardComponent;
  let fixture: ComponentFixture<CharityExplainerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharityExplainerCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityExplainerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
