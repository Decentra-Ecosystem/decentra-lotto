import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWinsModalComponent } from './my-wins-modal.component';

describe('MyWinsModalComponent', () => {
  let component: MyWinsModalComponent;
  let fixture: ComponentFixture<MyWinsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyWinsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWinsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
