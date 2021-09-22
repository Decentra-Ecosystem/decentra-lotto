import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsBoughtModalComponent } from './tickets-bought-modal.component';

describe('TicketsBoughtModalComponent', () => {
  let component: TicketsBoughtModalComponent;
  let fixture: ComponentFixture<TicketsBoughtModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsBoughtModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsBoughtModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
