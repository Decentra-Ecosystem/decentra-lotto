import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedPandaComponent } from './redpanda.component';

describe('RedPandaComponent', () => {
  let component: RedPandaComponent;
  let fixture: ComponentFixture<RedPandaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedPandaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedPandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
