import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedPandaExplainerCardComponent } from './redpanda-explainer-card.component';

describe('RedPandaExplainerCardComponent', () => {
  let component: RedPandaExplainerCardComponent;
  let fixture: ComponentFixture<RedPandaExplainerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedPandaExplainerCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedPandaExplainerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
